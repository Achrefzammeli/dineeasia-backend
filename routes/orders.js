import express from "express";
import Order from "../models/Order.js";
import { verifyToken, verifyRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/orders → client passe commande
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  await newOrder.save();

  const populatedOrder = await newOrder.populate([
    { path: "tableId", select: "number" },
    { path: "items.dish", select: "name price tags" },
  ]);

  const formattedOrder = formatOrder(populatedOrder);
  req.io.emit("orderReceived", formattedOrder);

  res.status(201).json(newOrder);
});

// GET /api/orders/global → admin voit tout
router.get("/global", verifyToken, verifyRole("ADMIN"), async (req, res) => {
  const orders = await Order.find().populate("clientId serverId tableId");
  res.json(orders);
});

// GET /api/orders/me → serveur/chef voit ses commandes
router.get("/me", verifyToken, async (req, res) => {
  const role = req.user.role;
  const query = role === "SERVER" ? { serverId: req.user.id } : {};
  const orders = await Order.find(query);
  res.json(orders);
});

// PATCH /api/orders/status/:id → mise à jour de l’état
router.patch("/status/:id", verifyToken, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );
  const populatedOrder = await order.populate([
    { path: "tableId", select: "number" },
    { path: "items.dish", select: "name price tags" },
  ]);
  req.io.emit("orderUpdated", formatOrder(populatedOrder));

  res.json(order);
});


export const formatOrder = (order) => {

  if (!order || !order.items || !order.tableId) {
    return null;
  }


  const total = order.items.reduce((sum, item) => {

    return sum + (item.dish?.price || 0) * (item.quantity || 0);
  }, 0);


  const categories = [
    ...new Set(order.items.flatMap((item) => item.dish?.tags || [])),
  ];


  const plats = order.items.map((item) => ({
    nom: item.dish?.name || "Unknown Dish",
    quantite: item.quantity || 0,
  }));

  // Map the status from French to English
  const statut =
    order.status === "reçue"
      ? "Received"
      : order.status === "prête"
      ? "Ready"
      : "Other Status";

  // Return the final formatted object
  return {
    id: order._id,
    table: order.tableId.number.toString(),
    total: total,
    date: order.createdAt,
    plats: plats,
    statut: statut,
    categories: categories,
  };
};
//this route done by yassine to get his desired shape of the payload to get orders
router.get("/orderstoday", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const orders = await Order.find({
      createdAt: {
        $gte: today,
        $lt: tomorrow,
      },
      status: { $in: ["reçue", "prête"] },
    })
      .populate({
        path: "tableId",
        select: "number",
      })
      .populate({
        path: "items.dish",
        select: "name price tags",
      })
      .exec();

    // Now, transform the fetched data to match the desired shape
    const transformedOrders = orders.map((order) => {
      const total = order.items.reduce((sum, item) => {
        return sum + item.dish.price * item.quantity;
      }, 0);

      const categories = [
        ...new Set(order.items.flatMap((item) => item.dish.tags)),
      ];

      const plats = order.items.map((item) => ({
        nom: item.dish.name,
        quantite: item.quantity,
      }));

      return {
        id: order._id,
        table: order.tableId.number.toString(),
        total: total,
        date: order.createdAt,
        plats: plats,
        statut:
          order.status === "reçue"
            ? "Received"
            : order.status === "prête"
            ? "Ready"
            : null,
        categories: categories,
      };
    });

    res.json(transformedOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
