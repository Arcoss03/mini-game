const badges = [
  {
    id: 1,
    type: "carbon-counter",
    name: "Conteur de carbone",
    msg: ["Éco-Héros", "Défenseur Vert", "ça consomme ici", "Polueur"],
    stat_description:"kg de CO2"
  },
  {
    id: 2,
    type: "conformity",
    name: "t'es plus dans la norme ou ?",
    msg: ["divergant", "pas comme toi", "la norme quoi", "comme toi"],
    stat_description:"dans la norme"
  },
  {
    id: 3,
    type: "nb-post",
    name: "nombre de post",
    msg: ["petit joueur", "postouilleur", "posteur fou", "mage noir"],
    stat_description:"TPF"
  },
];


// Fonction pour récupérer un badge par son ID
function getBadgeById(badgeId: number, level: number, stat: string) {
  // Utilisez la méthode find pour rechercher le badge
  const badge = badges.find((badge) => badge.id === badgeId);

  // Retournez le badge trouvé ou null si aucun badge n'a été trouvé
  if (level > 3 || level < 0 || !badge) {
    return null;
  }
  return {
    name: badge.name,
    type: badge.type,
    title: badge.msg[level],
    img_url:`https://uploads.ia-game.online/${badge.type}${level}.svg`,
    stat_description: badge.stat_description,
    statistic:stat
    
  };
}

function getBadgesListId() {
    //je veux map que l'id et le name
    return badges.map((badge) => {
        return {
            id: badge.id,
            name: badge.name
        };
    });
}

function getLevel(stat: number, levels: number[]) {
    let level = 0;
    for (let i = 0; i < levels.length; i++) {
        if (stat > levels[i]) {
            level = i + 1;
        }
    }
    return level;
}

export { getBadgeById, getBadgesListId, getLevel };