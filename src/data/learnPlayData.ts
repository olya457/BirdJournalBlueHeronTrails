export type BirdRead = {
  id: string;
  title: string;
  subtitle: string; 
  body: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[]; 
  correctIndex: number; 
};

export const BIRD_READS: BirdRead[] = [
  {
    id: 'read-01',
    title: "The Heron’s Hunting Style: Stillness, Timing, Precision",
    subtitle: 'Stillness, then sudden speed.',
    body:
      "Herons hunt like silent specialists. Instead of chasing prey, they rely on patience—standing motionless until the water “reveals” movement. Their long neck works like a spring: it coils, locks into position, then releases in a quick strike that can spear or grab fish, frogs, and insects. Many herons also adjust their technique to the conditions. In clear water they may stalk slowly, while in murkier shallows they pause more often, waiting for ripples and shadows. This combination of stillness and sudden speed is one of the most recognizable behaviors in wetland birdwatching.",
  },
  {
    id: 'read-02',
    title: "Why Herons Fly with Their Neck Tucked In",
    subtitle: 'A quick “shape test” in flight.',
    body:
      "A classic identification clue is the heron’s flight posture. Large herons typically fly with the neck folded into an “S” shape rather than stretched forward. This helps stabilize the body: a long neck is heavy, and tucking it keeps the bird balanced in the air. It also reduces wobble when taking off from tight reed edges or landing near trees and nesting colonies. In contrast, cranes, storks, and geese usually fly with the neck extended, creating a quick “shape test” even at a distance.",
  },
  {
    id: 'read-03',
    title: "Egrets and Herons: Close Relatives with Different Personalities",
    subtitle: 'Behavior + small details beat color.',
    body:
      "Egrets belong to the heron family, but they often feel different in behavior and appearance. Many egrets are more energetic while feeding—stepping quickly, pivoting, and sometimes stirring the water to flush prey. Larger herons tend to hunt in a calmer, heavier rhythm. Field identification often comes down to small details: leg color, foot color, and bill tone can be more reliable than size alone. Seeing multiple species feeding in the same area highlights how each bird uses a slightly different technique to succeed in similar habitats.",
  },
  {
    id: 'read-04',
    title: "Reedbed Specialists: How Bitterns Become Invisible",
    subtitle: 'Camouflage that works like magic.',
    body:
      "Bitterns are the secretive side of the heron family. Their plumage is patterned in streaks and warm browns that match reeds and dry stems. When threatened, many bitterns freeze and angle their bill upward, aligning their body with vertical vegetation. This “reed posture” can make them nearly impossible to spot, even when they’re only a few meters away. Because of this, bitterns are often detected by subtle movement, sudden flushes, or distinctive calls rather than long, clear views.",
  },
  {
    id: 'read-05',
    title: "The Heronry: A Nesting Colony Above the Wetlands",
    subtitle: 'A loud neighborhood in the trees.',
    body:
      "Herons often nest in colonies known as heronries. These can be located in trees, shrubs, or reedbeds, sometimes with dozens of nests packed close together. Colonies create a busy, noisy atmosphere: adults arrive with sticks and food, chicks call loudly, and neighboring birds argue over space. Nesting in groups can provide advantages such as shared vigilance against predators and easier location of productive feeding areas. At the same time, colonies can be stressful environments where competition is constant and timing matters.",
  },
  {
    id: 'read-06',
    title: "Wetlands: The Engine Room of Bird Diversity",
    subtitle: 'A living buffet that keeps changing.',
    body:
      "Wetlands are among the most productive ecosystems on Earth. Shallow water, mudflats, reeds, and flooded vegetation create rich zones for fish, insects, amphibians, and small crustaceans—exactly the food web that supports wading birds. Seasonal changes in water level can completely reshape a wetland, opening new feeding areas or hiding others under dense growth. This is why the same location can look “empty” one month and full of birds the next. For herons and many waterbirds, wetlands are not just habitat—they’re a shifting, living buffet.",
  },
  {
    id: 'read-07',
    title: "How to Tell Similar Herons Apart Without Stress",
    subtitle: 'Three cues for quick confidence.',
    body:
      "Many herons share the same overall silhouette: long legs, long bill, and a narrow body built for wading. The easiest way to separate similar species is to combine three cues: overall color pattern, neck markings, and habitat preference. Some species look darker and prefer dense reedbeds, while others stand openly in wide shallows. Bill thickness and leg color can also be surprisingly useful. Even if you don’t identify a bird immediately, noting size compared to nearby birds, posture, and feeding style often leads to a confident match later.",
  },
  {
    id: 'read-08',
    title: "Urban Waterways: Why Birds Thrive in Cities",
    subtitle: 'Surprising nature in busy places.',
    body:
      "It can feel surprising to see herons and egrets inside busy cities, but waterways often provide stable feeding opportunities. Canals, rivers, ponds, and even industrial harbors can hold fish and shelter, especially where banks have vegetation. Some species adapt quickly to human presence, learning predictable patterns: quiet mornings, regular feeding spots, and safe resting trees. Urban sightings also show how resilient many birds can be when water quality improves and green spaces are protected.",
  },
  {
    id: 'read-09',
    title: "The Language of Feathers: What Plumage Really Tells You",
    subtitle: 'Age, season, and hidden signals.',
    body:
      "Feathers aren’t just color—they’re information. In herons and egrets, plumage can signal age, season, and even mood. Juveniles often look browner or less sharply patterned than adults, with softer contrasts and fewer ornamental features. As breeding season approaches, many species develop extra plumes and richer tones that make them look more dramatic, especially around the head and neck. Outside breeding season, those details fade, and birds can look “simpler,” which is why the same species may feel harder to recognize in winter than in spring.",
  },
  {
    id: 'read-10',
    title: "Bills and Legs: The Two Best Clues in Quick Identification",
    subtitle: 'When silhouettes look similar.',
    body:
      "When silhouettes look similar, bills and legs often solve the puzzle. A heavier bill usually points to a bird built for larger prey, while a slimmer bill can indicate more delicate feeding. Leg color can be surprisingly consistent across species, and foot color can be a signature trait—especially in some egrets. Even in poor light, these features can stand out more reliably than subtle shades of grey or brown. Learning to look at bill shape first, and legs second, creates a simple mental shortcut for wetland bird ID.",
  },
  {
    id: 'read-11',
    title: "Still Water vs Moving Water: How Habitat Changes Behavior",
    subtitle: 'Same bird, different strategy.',
    body:
      "Herons don’t behave the same everywhere. In still ponds and marsh pools, they often stand for long periods, waiting for prey to drift close. Along rivers or tidal edges, the strategy can shift: birds reposition more often, tracking currents and using the movement of water to bring prey within reach. On windy days, feeding may concentrate in sheltered corners, while calm weather can spread birds across open shallows. Habitat doesn’t just determine where birds live—it influences how they hunt, where they rest, and how visible they are to observers.",
  },
  {
    id: 'read-12',
    title: "Tides and Mudflats: The Coastal Schedule You Can’t Ignore",
    subtitle: 'Water level controls everything.',
    body:
      "In coastal wetlands, tides control everything. As water drops, mudflats appear and expose small fish, worms, and crustaceans—turning the shoreline into a feeding stage. As the tide rises, birds shift to higher edges, channels, and pools where prey remains accessible. This movement can make coastal bird activity feel rhythmic: busy feeding windows, then quieter periods when the water covers the buffet. Understanding tide-driven change helps explain why a location can transform from “empty” to “full of birds” within a single hour.",
  },
  {
    id: 'read-13',
    title: "Night Life at the Water’s Edge",
    subtitle: 'Dusk feeders and quiet hunters.',
    body:
      "Some wetland birds are built for dusk. Species that feed in low light often rely on stillness and short, precise strikes rather than fast chases. At night, human disturbance drops, small fish and amphibians may move more confidently, and predators can hunt with less competition from daytime waders. This is why certain heron species are commonly seen roosting by day and becoming active later. Their calls can also change at dusk, making evening wetlands feel louder and more alive than midday.",
  },
  {
    id: 'read-14',
    title: "The Art of Standing Still: Why Waders Save Energy",
    subtitle: 'Less movement, more success.',
    body:
      "Standing motionless looks effortless, but it’s a highly efficient design choice. Wading birds conserve energy by reducing unnecessary movement and letting prey come to them. Many can lock joints in the legs to maintain posture with minimal muscle strain, which is helpful when hunting for long periods. Stillness also reduces surface disturbance, making prey less cautious. The result is a hunting strategy that’s quiet, low-energy, and effective—perfect for birds that spend hours in shallow water.",
  },
  {
    id: 'read-15',
    title: "Why Birds Choose Certain Trees for Colonies",
    subtitle: 'Location, safety, tradition.',
    body:
      "Heronries and mixed colonies don’t appear randomly. Birds often select trees close to reliable feeding areas, with enough height and branching to support heavy nests. Safety matters too: isolated stands, islands, or water-guarded sites can reduce access for land predators. Colonies create social noise and constant motion, which can improve predator detection but also increases conflict. Over time, successful colony sites become traditional—used year after year—until habitat changes, storms, or human disturbance force birds to relocate.",
  },
  {
    id: 'read-16',
    title: "Wetland Weather: How Wind, Rain, and Cold Change What You See",
    subtitle: 'Visibility follows the forecast.',
    body:
      "Bird visibility is tied to weather. Wind can push birds into sheltered bays and reed edges, while calm mornings often bring feeding into open shallows. Light rain may not stop activity, but heavy rain can reduce hunting success by breaking up water visibility. Cold snaps can concentrate birds where water stays unfrozen, creating sudden “hotspots” of activity. Weather also affects photography: bright sun can wash out white plumage, while overcast light reveals detail and reduces harsh reflections off water.",
  },
  {
    id: 'read-17',
    title: "Migration: The Invisible Highway Over Your Head",
    subtitle: 'Seasonal movement across continents.',
    body:
      "Many wetland birds live on seasonal schedules that span continents. Migration isn’t a single event—it’s a chain of stops where birds refuel at wetlands, estuaries, and floodplains. Some species move in broad fronts, while others follow coastlines and river systems. During peak migration, a familiar pond can suddenly host birds that were never seen there in summer or winter. These arrivals can be brief, which is why short-term sightings often feel exciting and “rare,” even when the species is common elsewhere.",
  },
  {
    id: 'read-18',
    title: "Conservation Without Drama: Small Changes That Matter",
    subtitle: 'Quiet actions with big impact.',
    body:
      "Wetland birds respond quickly to habitat quality. When water becomes cleaner, reedbeds expand, and shorelines are protected, bird diversity can rise within a few seasons. Conversely, draining wetlands, removing vegetation, and frequent disturbance can reduce breeding success and push birds away from reliable sites. Conservation doesn’t always look like huge projects; sometimes it’s the decision to keep a reed strip, reduce shoreline noise during breeding season, or protect a small marsh that acts as a migration stop. For waders, small wetlands can be as important as famous reserves.",
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which bird is known for drying its wings spread wide after fishing?',
    options: ['Great Egret', 'Grey Heron', 'Great Cormorant', 'Little Bittern'],
    correctIndex: 2,
  },
  {
    id: 'q2',
    question: 'Which bird often follows cattle or tractors to catch insects?',
    options: ['Great Blue Heron', 'Cattle Egret', 'Black-headed Gull', 'Eurasian Bittern'],
    correctIndex: 1,
  },
  {
    id: 'q3',
    question: 'A classic heron flight clue is:',
    options: [
      'Neck tucked back in an “S” shape',
      'Neck stretched straight forward',
      'Legs tucked under the belly',
      'Wings held perfectly still',
    ],
    correctIndex: 0,
  },
  {
    id: 'q4',
    question: 'Which species is most active at dusk/night and often has red eyes?',
    options: ['Purple Heron', 'Great Egret', 'Little Egret', 'Black-crowned Night Heron'],
    correctIndex: 3,
  },
  {
    id: 'q5',
    question: 'Which bird is famous for a deep “booming” call across reedbeds?',
    options: ['Black-headed Gull', 'Eurasian Bittern', 'Mallard', 'Common Moorhen'],
    correctIndex: 1,
  },
  {
    id: 'q6',
    question: 'Which feature is a key ID clue for the Little Egret?',
    options: ['Green head and curled tail', 'Bright red bill with yellow tip', 'Yellow feet with black legs', 'White body with orange wings'],
    correctIndex: 2,
  },
  {
    id: 'q7',
    question: '“Turquoise-and-orange flash” along rivers best describes:',
    options: ['Great Blue Heron', 'Great Cormorant', 'Common Kingfisher', 'Cattle Egret'],
    correctIndex: 2,
  },
  {
    id: 'q8',
    question: 'Which bird is most likely to freeze hidden in reeds using camouflage posture?',
    options: ['Great Egret', 'Little Bittern', 'Black-headed Gull', 'Great Cormorant'],
    correctIndex: 1,
  },
  {
    id: 'q9',
    question: 'What is a “heronry”?',
    options: ['A heron feeding technique', 'A colony nesting site for herons', 'A type of wetland plant', 'A migration map route'],
    correctIndex: 1,
  },
  {
    id: 'q10',
    question: 'Which bird has a red bill with a yellow tip and often flicks its white undertail?',
    options: ['Black-headed Gull', 'Great Egret', 'Common Moorhen', 'Purple Heron'],
    correctIndex: 2,
  },
  {
    id: 'q11',
    question: 'Which pair can be confusing at a glance because both are large white waders?',
    options: ['Great Egret & Little Egret', 'Mallard & Moorhen', 'Kingfisher & Gull', 'Cormorant & Bittern'],
    correctIndex: 0,
  },
  {
    id: 'q12',
    question: 'Which bird usually hunts from a perch, then dives headfirst for fish?',
    options: ['Grey Heron', 'Great Cormorant', 'Common Kingfisher', 'Black-headed Gull'],
    correctIndex: 2,
  },
  {
    id: 'q13',
    question: 'Mallards typically feed by:',
    options: ['Dabbling and tipping forward in shallow water', 'Spearing fish like a heron', 'Hovering to grab food', 'Only hunting at night'],
    correctIndex: 0,
  },
  {
    id: 'q14',
    question: 'Which statement is correct?',
    options: ['Herons fly with legs tucked in', 'Herons never nest in trees', 'Egrets are always found only near oceans', 'Large herons usually fly with the neck tucked back'],
    correctIndex: 3,
  },
  {
    id: 'q15',
    question: 'Which habitat best fits the Purple Heron?',
    options: ['Dense reedbeds and marsh channels', 'High mountain rock faces', 'Open desert plains', 'Deep offshore waters'],
    correctIndex: 0,
  },
  {
    id: 'q16',
    question: 'Which bird is most likely to hover and dip to pick food from the water surface?',
    options: ['Black-headed Gull', 'Common Moorhen', 'Little Bittern', 'Purple Heron'],
    correctIndex: 0,
  },
  {
    id: 'q17',
    question: 'Which species is widely seen in city ponds and parks and is a great “first log” bird?',
    options: ['Eurasian Bittern', 'Purple Heron', 'Mallard', 'Little Bittern'],
    correctIndex: 2,
  },
  {
    id: 'q18',
    question: 'Which bird is the best match for “patient hunter that stands still, then strikes fast at fish”?',
    options: ['Great Blue Heron', 'Black-headed Gull', 'Cattle Egret', 'Common Moorhen'],
    correctIndex: 0,
  },
  {
    id: 'q19',
    question: 'Which bird is most likely to be seen walking on floating vegetation at the edge of reeds?',
    options: ['Great Cormorant', 'Common Moorhen', 'Great Egret', 'Common Kingfisher'],
    correctIndex: 1,
  },
  {
    id: 'q20',
    question: 'Which species is more secretive and reed-focused than the Grey Heron, with richer darker tones?',
    options: ['Great Egret', 'Purple Heron', 'Black-headed Gull', 'Mallard'],
    correctIndex: 1,
  },
  {
    id: 'q21',
    question: 'Which bird is stocky with a black cap/back and tends to roost by day, feeding more at dusk?',
    options: ['Cattle Egret', 'Great Blue Heron', 'Black-crowned Night Heron', 'Little Egret'],
    correctIndex: 2,
  },
  {
    id: 'q22',
    question: 'Which bird is the smallest on this list (around 16–17 cm)?',
    options: ['Common Kingfisher', 'Black-headed Gull', 'Common Moorhen', 'Little Egret'],
    correctIndex: 0,
  },
  {
    id: 'q23',
    question: 'Which bird is best described as “active hunter that foot-stirs water to flush prey”?',
    options: ['Great Cormorant', 'Grey Heron', 'Little Egret', 'Eurasian Bittern'],
    correctIndex: 2,
  },
  {
    id: 'q24',
    question: 'Which bird is most likely to be seen swimming low in the water while chasing fish underwater?',
    options: ['Great Cormorant', 'Purple Heron', 'Cattle Egret', 'Black-headed Gull'],
    correctIndex: 0,
  },
  {
    id: 'q25',
    question: 'Which species often nests in colonies with large stick platforms, sometimes shared with other waders?',
    options: ['Grey Heron', 'Common Kingfisher', 'Common Moorhen', 'Black-headed Gull'],
    correctIndex: 0,
  },
];
