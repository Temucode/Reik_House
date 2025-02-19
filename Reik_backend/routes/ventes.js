// Route pour obtenir les statistiques des ventes
router.get("/stats", async (req, res) => {
    const { period } = req.query; // La période est passée dans les query params
  
    // Vérifie que la période est valide
    if (!period || !['jour', 'semaine', 'mois', 'an'].includes(period)) {
      return res.status(400).json({ message: "Période invalide. Utilisez 'jour', 'semaine', 'mois' ou 'an'." });
    }
  
    try {
      let matchStage = {};
  
      // Si la période est 'jour', on commence à partir d'aujourd'hui
      if (period === 'jour') {
        matchStage = {
          $match: {
            dateVente: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)), // À partir du début de la journée
            }
          }
        };
      }
  
      let groupStage;
  
      // Agrégation par période
      switch (period) {
        case 'jour':
          groupStage = {
            $group: {
              _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateVente" } },
              totalVentes: { $sum: "$quantite" },
            }
          };
          break;
  
        case 'semaine':
          groupStage = {
            $group: {
              _id: { $isoWeek: "$dateVente" }, // Par numéro de semaine
              totalVentes: { $sum: "$quantite" },
            }
          };
          break;
  
        case 'mois':
          groupStage = {
            $group: {
              _id: { $month: "$dateVente" }, // Par mois
              totalVentes: { $sum: "$quantite" },
            }
          };
          break;
  
        case 'an':
          groupStage = {
            $group: {
              _id: { $year: "$dateVente" }, // Par année
              totalVentes: { $sum: "$quantite" },
            }
          };
          break;
  
        default:
          return res.status(400).json({ message: "Période invalide." });
      }
  
      const ventesStats = await Vente.aggregate([matchStage, groupStage]);
  
      res.json({
        data: ventesStats
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques des ventes :", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  