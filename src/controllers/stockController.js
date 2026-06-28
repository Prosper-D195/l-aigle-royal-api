const prisma = require('../prisma');

// 1. Récupérer tout l'inventaire
exports.getAllStock = async (req, res) => {
  try {
    const items = await prisma.stock.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des stocks : " + error.message });
  }
};

// 2. Ajouter un nouvel intrant/matériel
exports.createStockItem = async (req, res) => {
  try {
    const { name, quantity, unit, minQuantity, category } = req.body;

    if (!name || quantity === undefined || !unit) {
      return res.status(400).json({ error: "Le nom, la quantité et l'unité sont requis." });
    }

    const newItem = await prisma.stock.create({
      data: {
        name,
        quantity: parseFloat(quantity),
        unit,
        minQuantity: minQuantity ? parseFloat(minQuantity) : 0,
        category
      }
    });

    res.status(201).json({ message: "Article ajouté au stock !", item: newItem });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'ajout au stock : " + error.message });
  }
};

// 3. Modifier la quantité ou les détails d'un stock (ex: après utilisation sur le terrain)
exports.updateStockItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, minQuantity, name, category } = req.body;

    const updatedItem = await prisma.stock.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(quantity !== undefined && { quantity: parseFloat(quantity) }),
        ...(minQuantity !== undefined && { minQuantity: parseFloat(minQuantity) }),
        ...(category && { category })
      }
    });

    res.json({ message: "Stock mis à jour avec succès !", item: updatedItem });
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la modification du stock : " + error.message });
  }
};