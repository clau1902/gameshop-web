// Types
export interface Store {
  name: string;
  url: string;
  price: number;
  logo: string;
}

export interface Game {
  id: string;
  title: string;
  cover: string;
  genres: string[];
  platforms: string[];
  releaseDate: string;
  developer: string;
  publisher: string;
  description: string;
  storyline: string;
  features: string[];
  screenshots: string[];
  stores: Store[];
}

// Sample data with actual game screenshots
export const GAMES: Game[] = [
  {
    id: "1",
    title: "Elden Ring",
    cover: "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg",
    genres: ["Action", "RPG", "Souls-like"],
    platforms: ["PC", "PlayStation", "Xbox"],
    releaseDate: "2022-02-25",
    developer: "FromSoftware",
    publisher: "Bandai Namco Entertainment",
    description: "A new fantasy action RPG where you rise as a Tarnished to explore the Lands Between, a vast world full of danger and discovery.",
    storyline: "The Elden Ring, the source of the Erdtree's power, was shattered. Its shards, known as the Great Runes, were claimed by the demigod children of Queen Marika the Eternal, and the madness of their newfound power led to war. The Shattering. A war that meant abandonment by the Greater Will. And now the guidance of grace will be brought to the Tarnished who were spurned by the grace of gold and exiled from the Lands Between. Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    features: [
      "Vast open world exploration",
      "Deep character customization",
      "Challenging boss battles",
      "Multiplayer co-op and PvP",
      "Rich lore written by George R.R. Martin",
      "Dynamic weather and day/night cycle"
    ],
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/header.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/capsule_616x353.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_hero.jpg"
    ],
    stores: [
      { name: "Steam", url: "https://store.steampowered.com/app/1245620/ELDEN_RING/", price: 59.99, logo: "🎮" },
      { name: "PlayStation Store", url: "https://store.playstation.com/en-us/product/UP0700-PPSA05916_00-ELDENRING0000000", price: 59.99, logo: "🎲" },
      { name: "Xbox Store", url: "https://www.xbox.com/en-US/games/store/elden-ring/9P3J32CTXLRZ", price: 59.99, logo: "💚" },
    ],
  },
  {
    id: "2",
    title: "Baldur's Gate 3",
    cover: "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900.jpg",
    genres: ["RPG", "Turn-Based", "Fantasy"],
    platforms: ["PC", "PlayStation", "Xbox"],
    releaseDate: "2023-08-03",
    developer: "Larian Studios",
    publisher: "Larian Studios",
    description: "Gather your party and return to the Forgotten Realms in this next-generation D&D RPG filled with choices and consequences.",
    storyline: "A mysterious plague called the Absolute is sweeping the land. You and your companions have been infected with a Mind Flayer tadpole that threatens to transform you into horrific monsters. As you race against time to find a cure, you'll uncover a sinister conspiracy that threatens all of Faerûn. Your choices will shape the fate of the realms—will you resist the corruption within, or embrace the power it offers? Forge unlikely alliances, romance complex companions, and decide the destiny of countless lives in this epic tale of survival, sacrifice, and the eternal struggle between good and evil.",
    features: [
      "Full D&D 5th Edition ruleset",
      "Turn-based tactical combat",
      "Deep companion relationships and romance",
      "Over 174 hours of cinematics",
      "Co-op multiplayer for up to 4 players",
      "Endless character build possibilities"
    ],
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/header.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/capsule_616x353.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_hero.jpg"
    ],
    stores: [
      { name: "Steam", url: "https://store.steampowered.com/app/1086940/Baldurs_Gate_3/", price: 59.99, logo: "🎮" },
      { name: "GOG", url: "https://www.gog.com/en/game/baldurs_gate_iii", price: 59.99, logo: "🌟" },
      { name: "PlayStation Store", url: "https://store.playstation.com/en-us/product/UP3526-PPSA09159_00-BG3STANDARDEDPS5", price: 69.99, logo: "🎲" },
    ],
  },
  {
    id: "3",
    title: "Cyberpunk 2077",
    cover: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg",
    genres: ["Action", "RPG", "Open World"],
    platforms: ["PC", "PlayStation", "Xbox"],
    releaseDate: "2020-12-10",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    description: "An open-world action-adventure RPG set in Night City, a megalopolis obsessed with power, glamour and body modification.",
    storyline: "In the year 2077, Night City is the most dangerous metropolis in America. You are V, a mercenary outlaw going after a one-of-a-kind implant that holds the key to immortality. But when a heist goes wrong, you end up with a digital ghost in your head—the legendary rockerboy terrorist Johnny Silverhand, played by Keanu Reeves. As Johnny's personality slowly overwrites your own, you must race against time to save yourself and uncover the dark secrets of Night City's most powerful corporations. In a city of dreams and nightmares, the line between hero and villain has never been blurrier.",
    features: [
      "Immersive open-world Night City",
      "Deep branching narrative",
      "Extensive character customization",
      "Cybernetic augmentations",
      "Multiple playstyles: stealth, hacking, combat",
      "Relationships and romance options"
    ],
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_hero.jpg"
    ],
    stores: [
      { name: "Steam", url: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/", price: 59.99, logo: "🎮" },
      { name: "GOG", url: "https://www.gog.com/en/game/cyberpunk_2077", price: 59.99, logo: "🌟" },
      { name: "Epic Games", url: "https://store.epicgames.com/en-US/p/cyberpunk-2077", price: 59.99, logo: "🎯" },
    ],
  },
  {
    id: "4",
    title: "The Legend of Zelda: Tears of the Kingdom",
    cover: "https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg",
    genres: ["Action", "Adventure", "Open World"],
    platforms: ["Switch"],
    releaseDate: "2023-05-12",
    developer: "Nintendo",
    publisher: "Nintendo",
    description: "Explore the vast land and skies of Hyrule with new abilities that let Link craft weapons and vehicles in this sequel to Breath of the Wild.",
    storyline: "In this sequel to The Legend of Zelda: Breath of the Wild, you'll decide your own path through the sprawling landscapes of Hyrule and the mysterious islands floating in the vast skies above. Can you harness the power of Link's new abilities to fight back against the malevolent forces that threaten the kingdom? Beneath Hyrule Castle, Link and Zelda discover a mummified corpse held in place by a mysterious arm. When they accidentally awaken this ancient evil—Ganondorf, the Demon King—Zelda vanishes, and Link must embark on a journey across land, sky, and even the depths below Hyrule to find her and stop a cataclysm that threatens all of existence.",
    features: [
      "Revolutionary Ultrahand and Fuse abilities",
      "Build vehicles, weapons, and contraptions",
      "Explore sky islands and underground depths",
      "Seamless open-world exploration",
      "Physics-based puzzle solving",
      "Hundreds of shrines and side quests"
    ],
    screenshots: [
      "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000063714/dbed2ffaa839b06e765f24a64bab72ddcbae8674fd5f05e2ade72a72d4941701",
      "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/ncom/software/switch/70010000063714/811461c8cd6a3999b0632dc682c8d0ba8c4d4e96add4e287fb7e1a80c9589fa6",
      "https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg"
    ],
    stores: [
      { name: "Nintendo eShop", url: "https://www.nintendo.com/us/store/products/the-legend-of-zelda-tears-of-the-kingdom-switch/", price: 69.99, logo: "🍄" },
      { name: "Amazon", url: "https://www.amazon.com/Legend-Zelda-Tears-Kingdom-Nintendo-Switch/dp/B0C2TXWC3M", price: 69.99, logo: "📦" },
      { name: "GameStop", url: "https://www.gamestop.com/video-games/nintendo-switch/products/the-legend-of-zelda-tears-of-the-kingdom---nintendo-switch/355156.html", price: 69.99, logo: "🏪" },
    ],
  },
  {
    id: "5",
    title: "Hades",
    cover: "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/library_600x900.jpg",
    genres: ["Roguelike", "Action", "Indie"],
    platforms: ["PC", "PlayStation", "Xbox", "Switch"],
    releaseDate: "2020-09-17",
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    description: "Defy the god of the dead as you battle out of the Underworld in this roguelike dungeon crawler with award-winning narrative.",
    storyline: "You are Zagreus, immortal son of Hades, and you're not happy at home. Your father, the Lord of the Underworld, has forbidden you from leaving his realm, but you're determined to escape and find your long-lost mother on the surface. With each attempt, you'll fight through hordes of shades and mythological monsters, receive blessings from the Olympian gods who support your rebellion, and slowly uncover the truth about your family. Death is not the end—it's just a chance to try again, armed with new weapons, abilities, and knowledge. Can you defy death itself and escape the Underworld?",
    features: [
      "Fast-paced roguelike combat",
      "Progressive story that unfolds over runs",
      "Deep relationships with characters",
      "Multiple weapon types and builds",
      "Boons from Olympian gods",
      "Stunning hand-painted art"
    ],
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/header.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/capsule_616x353.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1145360/library_hero.jpg"
    ],
    stores: [
      { name: "Steam", url: "https://store.steampowered.com/app/1145360/Hades/", price: 24.99, logo: "🎮" },
      { name: "Epic Games", url: "https://store.epicgames.com/en-US/p/hades", price: 24.99, logo: "🎯" },
      { name: "Nintendo eShop", url: "https://www.nintendo.com/us/store/products/hades-switch/", price: 24.99, logo: "🍄" },
    ],
  },
  {
    id: "6",
    title: "God of War Ragnarök",
    cover: "https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/library_600x900.jpg",
    genres: ["Action", "Adventure", "Hack and Slash"],
    platforms: ["PC", "PlayStation"],
    releaseDate: "2022-11-09",
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    description: "Embark on an epic journey as Kratos and Atreus struggle with holding on and letting go across the Nine Realms.",
    storyline: "Fimbulwinter is well underway. Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle that will end the world. Along the way, they will explore stunning, mythical landscapes, and face fearsome enemies in the form of Norse gods and monsters. The threat of Ragnarök grows ever closer. Kratos and Atreus must choose between their own safety and the safety of the realms. As the lines between fathers and sons, gods and mortals, warriors and fathers blur, they must confront the ultimate question: can one change their destiny?",
    features: [
      "Epic Norse mythology conclusion",
      "Visceral combat with new weapons",
      "Explore all Nine Realms",
      "Deep father-son narrative",
      "Stunning next-gen graphics",
      "Puzzle-filled exploration"
    ],
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/header.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/capsule_616x353.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/2322010/library_hero.jpg"
    ],
    stores: [
      { name: "Steam", url: "https://store.steampowered.com/app/2322010/God_of_War_Ragnarok/", price: 59.99, logo: "🎮" },
      { name: "PlayStation Store", url: "https://store.playstation.com/en-us/product/UP9000-PPSA08332_00-YOURLEGENDGODEPS", price: 69.99, logo: "🎲" },
      { name: "Epic Games", url: "https://store.epicgames.com/en-US/p/god-of-war-ragnarok", price: 59.99, logo: "🎯" },
    ],
  },
  {
    id: "7",
    title: "Red Dead Redemption 2",
    cover: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_600x900.jpg",
    genres: ["Action", "Adventure", "Open World"],
    platforms: ["PC", "PlayStation", "Xbox"],
    releaseDate: "2018-10-26",
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    description: "America, 1899. Arthur Morgan and the Van der Linde gang must flee across America as federal agents hunt them down.",
    storyline: "America, 1899. The end of the Wild West era has begun. After a robbery goes badly wrong in the western town of Blackwater, Arthur Morgan and the Van der Linde gang are forced to flee. With federal agents and the best bounty hunters in the nation massing on their heels, the gang must rob, steal and fight their way across the rugged heartland of America in order to survive. As deepening internal divisions threaten to tear the gang apart, Arthur must make a choice between his own ideals and loyalty to the gang who raised him. Experience the epic tale of Arthur Morgan and the Van der Linde gang as they face the dawn of a new age.",
    features: [
      "Vast, detailed open world",
      "Deep honor system",
      "Realistic survival mechanics",
      "Extensive story campaign",
      "Red Dead Online multiplayer",
      "Stunning wildlife and ecosystems"
    ],
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/header.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/library_hero.jpg"
    ],
    stores: [
      { name: "Steam", url: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/", price: 59.99, logo: "🎮" },
      { name: "Rockstar Store", url: "https://store.rockstargames.com/en/game/buy-red-dead-redemption-2", price: 59.99, logo: "⭐" },
      { name: "Epic Games", url: "https://store.epicgames.com/en-US/p/red-dead-redemption-2", price: 59.99, logo: "🎯" },
    ],
  },
  {
    id: "8",
    title: "Hollow Knight",
    cover: "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_600x900.jpg",
    genres: ["Metroidvania", "Action", "Indie"],
    platforms: ["PC", "PlayStation", "Xbox", "Switch"],
    releaseDate: "2017-02-24",
    developer: "Team Cherry",
    publisher: "Team Cherry",
    description: "Descend into the depths of Hallownest, a vast ruined kingdom beneath the surface, and uncover ancient secrets.",
    storyline: "Beneath the fading town of Dirtmouth sleeps an ancient, ruined kingdom. Many are drawn below the surface, searching for riches, or glory, or answers to old secrets. You are the Knight, a mysterious silent warrior who descends into Hallownest's depths. As you explore twisting caverns, ancient cities, and deadly wastelands, you'll uncover the history of this strange world and the plague that drove its citizens to madness. Face twisted creatures and befriend bizarre bugs. Master nail combat and powerful spells. Uncover the mysteries at Hallownest's heart—if you can survive the journey.",
    features: [
      "Expansive interconnected world",
      "Challenging but fair combat",
      "Over 130 enemies and 30 bosses",
      "Beautiful hand-drawn art",
      "Atmospheric soundtrack",
      "Multiple endings"
    ],
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/header.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/capsule_616x353.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/367520/library_hero.jpg"
    ],
    stores: [
      { name: "Steam", url: "https://store.steampowered.com/app/367520/Hollow_Knight/", price: 14.99, logo: "🎮" },
      { name: "GOG", url: "https://www.gog.com/en/game/hollow_knight", price: 14.99, logo: "🌟" },
      { name: "Nintendo eShop", url: "https://www.nintendo.com/us/store/products/hollow-knight-switch/", price: 14.99, logo: "🍄" },
    ],
  },
  {
    id: "9",
    title: "The Witcher 3: Wild Hunt",
    cover: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg",
    genres: ["RPG", "Action", "Open World"],
    platforms: ["PC", "PlayStation", "Xbox", "Switch"],
    releaseDate: "2015-05-19",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    description: "As Geralt of Rivia, a monster hunter, search for the Child of Prophecy in a vast open world rich with adventure.",
    storyline: "You are Geralt of Rivia, a witcher—a mutated monster hunter for hire. Years ago, you trained a young girl named Ciri, who possesses Elder Blood that gives her the power to manipulate time and space. Now the Wild Hunt, a cavalcade of spectral riders from another world, seeks Ciri for her power. As war rages across the Northern Kingdoms and the Nilfgaardian Empire, you must track down Ciri before the Wild Hunt finds her. Your journey will take you from war-torn villages to magical islands, from royal courts to haunted forests. Along the way, your choices will shape the fate of nations and the lives of those you meet.",
    features: [
      "Massive open world with 100+ hours",
      "Meaningful choices and consequences",
      "Monster hunting contracts",
      "Gwent card game",
      "Two massive story expansions",
      "Next-gen visual upgrade"
    ],
    screenshots: [
      "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/capsule_616x353.jpg",
      "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_hero.jpg"
    ],
    stores: [
      { name: "Steam", url: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/", price: 39.99, logo: "🎮" },
      { name: "GOG", url: "https://www.gog.com/en/game/the_witcher_3_wild_hunt", price: 39.99, logo: "🌟" },
      { name: "Epic Games", url: "https://store.epicgames.com/en-US/p/the-witcher-3-wild-hunt", price: 39.99, logo: "🎯" },
    ],
  },
];

export const ALL_GENRES = Array.from(new Set(GAMES.flatMap((g) => g.genres))).sort();
export const ALL_PLATFORMS = Array.from(new Set(GAMES.flatMap((g) => g.platforms))).sort();
