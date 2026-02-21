export type BirdArticle = {
  id: string; 
  title: string; 
  body: string; 
};

export const BIRD_ARTICLES: BirdArticle[] = [
  {
    id: '01',
    title: 'Great Blue Heron',
    body:
      'Scientific name: Ardea herodias\n' +
      'Map pin (example): 44.4280, -110.5885 (Yellowstone National Park, USA)\n' +
      'Common habitat: Lakes, rivers, marshes, coastal shallows (North America)\n' +
      'Size: 97–137 cm tall; wingspan 167–201 cm\n' +
      'Detailed description:\n' +
      'A tall, slate-blue wader with a long neck that folds into an “S” in flight. Adults show a pale face with a dark stripe extending into plume-like head feathers, and a strong yellowish bill made for spearing prey. It hunts with extreme patience—standing still, then striking fast at fish, frogs, and small animals. In breeding season it nests in colonies (“heronries”) high in trees, filling wetlands with harsh croaks.',
  },
  {
    id: '02',
    title: 'Grey Heron',
    body:
      'Scientific name: Ardea cinerea\n' +
      'Map pin (example): 51.5080, -0.0870 (River Thames, London, UK)\n' +
      'Common habitat: Rivers, ponds, wetlands, estuaries (Europe, Asia, Africa)\n' +
      'Size: 84–102 cm; wingspan 155–195 cm\n' +
      'Detailed description:\n' +
      'A large grey heron with a pale neck, dark streaking, and a striking black eyebrow plume. It flies with slow wingbeats, neck tucked back, legs trailing. Grey Herons are adaptable: they fish in shallows, hunt frogs in reed margins, and even forage in fields. They often tolerate people near waterways and nest in noisy colonies of big stick platforms.',
  },
  {
    id: '03',
    title: 'Purple Heron',
    body:
      'Scientific name: Ardea purpurea\n' +
      'Map pin (example): 52.3860, 4.9010 (Reed wetlands near Amsterdam, NL)\n' +
      'Common habitat: Dense reedbeds, marshes, wet meadows (Europe, Africa, Asia)\n' +
      'Size: 78–97 cm; wingspan 120–152 cm\n' +
      'Detailed description:\n' +
      'Slimmer and more secretive than Grey Heron, with a chestnut-brown neck and richer, darker tones. It uses reed cover like camouflage, often freezing with bill angled upward to blend with stems. It hunts fish, amphibians, insects, and small reptiles in vegetated channels. Seeing one out in the open feels rare because it prefers thick marsh cover.',
  },
  {
    id: '04',
    title: 'Great Egret',
    body:
      'Scientific name: Ardea alba\n' +
      'Map pin (example): 27.6648, -81.5158 (Wetlands, Florida, USA)\n' +
      'Common habitat: Marshes, lagoons, riverbanks, coastal flats (worldwide)\n' +
      'Size: 80–102 cm; wingspan 131–170 cm\n' +
      'Detailed description:\n' +
      'A large, elegant white heron with a long yellow bill and black legs. In breeding season it grows delicate plume-like feathers. It hunts by stalking and sudden lunges, sometimes stirring the water to flush prey. Great Egrets often stand tall in open shallows and mix with other wading birds, looking notably “regal” in posture.',
  },
  {
    id: '05',
    title: 'Little Egret',
    body:
      'Scientific name: Egretta garzetta\n' +
      'Map pin (example): 41.9028, 12.4964 (Urban riverbanks, Rome, IT)\n' +
      'Common habitat: Wetlands, canals, coasts, rice fields (Europe, Africa, Asia, Australia)\n' +
      'Size: 55–65 cm; wingspan 88–106 cm\n' +
      'Detailed description:\n' +
      'A bright white egret with black legs and vivid yellow feet—its best field mark. It hunts actively: quick steps, sudden turns, and “foot-stirring” to flush fish and crustaceans. Breeding birds show long head plumes and a more ornamental silhouette. Its energetic feeding style makes it easy to recognize even from far away.',
  },
  {
    id: '06',
    title: 'Cattle Egret',
    body:
      'Scientific name: Bubulcus ibis\n' +
      'Map pin (example): -1.2864, 36.8172 (Grasslands near Nairobi, KE)\n' +
      'Common habitat: Pastures, farmland, wetland edges; often with livestock (worldwide)\n' +
      'Size: 46–56 cm; wingspan 88–96 cm\n' +
      'Detailed description:\n' +
      'A compact egret that often follows cattle, horses, and farm machinery to catch insects disturbed by movement. It can be common far from open water. Breeding adults may show warm buff/orange tones on head and chest. It forms large mixed colonies and is famous for its successful range expansion.',
  },
  {
    id: '07',
    title: 'Black-crowned Night Heron',
    body:
      'Scientific name: Nycticorax nycticorax\n' +
      'Map pin (example): 40.7128, -74.0060 (Urban waterways, New York City, USA)\n' +
      'Common habitat: Marshes, lake edges, canals, urban waterways (worldwide)\n' +
      'Size: 58–65 cm; wingspan 105–112 cm\n' +
      'Detailed description:\n' +
      'Stocky with a short neck, black crown/back, grey wings, and red eyes. It often feeds at dusk and night, standing at the water’s edge waiting for fish and amphibians. By day it roosts quietly in trees or dense vegetation, sometimes in groups. Its flight looks chunky and direct, and its croaking calls can be surprisingly loud.',
  },
  {
    id: '08',
    title: 'Little Bittern',
    body:
      'Scientific name: Ixobrychus minutus\n' +
      'Map pin (example): 45.2396, 29.0287 (Danube Delta, RO/UA region)\n' +
      'Common habitat: Reedbeds, marsh vegetation, dense wetland edges (Europe, Africa, Asia)\n' +
      'Size: 27–36 cm; wingspan 40–58 cm\n' +
      'Detailed description:\n' +
      'A small, elusive reed specialist that moves like a shadow through wetland plants. It often climbs reed stems and freezes in place when alarmed. Males show darker upperparts; females are browner and more streaked. It feeds on small fish, insects, and amphibians in narrow, vegetated channels. Most sightings are brief—perfect for a “quick log” entry.',
  },
  {
    id: '09',
    title: 'Eurasian Bittern',
    body:
      'Scientific name: Botaurus stellaris\n' +
      'Map pin (example): 52.6490, 1.4730 (Norfolk Broads, UK)\n' +
      'Common habitat: Large reedbeds, marshes, protected wetlands (Europe, Asia)\n' +
      'Size: 69–81 cm; wingspan 100–130 cm\n' +
      'Detailed description:\n' +
      'A heavy, beautifully patterned bird that vanishes into reeds with streaked brown camouflage. It’s famous for its deep “booming” call in spring, carrying far across marshes. It hunts slowly along reed margins for fish and amphibians, striking with a sudden jab. Often heard more than seen, making it a rewarding “audio notes” species if you add sound later.',
  },
  {
    id: '10',
    title: 'American Bittern',
    body:
      'Scientific name: Botaurus lentiginosus\n' +
      'Map pin (example): 43.2994, -74.2179 (Adirondack wetlands, NY, USA)\n' +
      'Common habitat: Marshes with cattails, wet meadows, reed edges (North America)\n' +
      'Size: 58–85 cm; wingspan 91–115 cm\n' +
      'Detailed description:\n' +
      'A brown, streaked bittern known for “sky-pointing” camouflage—bill angled upward to blend with reeds. It walks slowly through shallow marshes hunting fish, insects, and frogs. When flushed, it lifts off suddenly from cover and flies with broad wings. Spring calls are distinctive, often described as gulping or pumping.',
  },
  {
    id: '11',
    title: 'Common Kingfisher',
    body:
      'Scientific name: Alcedo atthis\n' +
      'Map pin (example): 48.8566, 2.3522 (River Seine, Paris, FR)\n' +
      'Common habitat: Clear rivers, streams, canals, lakes (Europe, Asia, North Africa)\n' +
      'Size: 16–17 cm; wingspan 24–26 cm\n' +
      'Detailed description:\n' +
      'A jewel-blue flash with bright turquoise upperparts and orange underparts. It hunts from a perch, then dives headfirst to seize small fish. Kingfishers often return to the same favorite branches, which fits a “repeat location” journaling feature well. Their sharp whistled call is often the first clue one has zipped past.',
  },
  {
    id: '12',
    title: 'Mallard',
    body:
      'Scientific name: Anas platyrhynchos\n' +
      'Map pin (example): 50.4501, 30.5234 (City ponds, Kyiv, UA)\n' +
      'Common habitat: Ponds, lakes, rivers, city parks, wetlands (Northern Hemisphere; introduced elsewhere)\n' +
      'Size: 50–65 cm; wingspan 81–98 cm\n' +
      'Detailed description:\n' +
      'A highly adaptable duck common in wild marshes and urban ponds. Males have a glossy green head and curled tail feathers; females are mottled brown. Mallards feed by dabbling—tipping forward to graze plants, seeds, and small aquatic life. They’re ideal for onboarding because users can log an easy first sighting and learn the app flow quickly.',
  },
  {
    id: '13',
    title: 'Black-headed Gull',
    body:
      'Scientific name: Chroicocephalus ridibundus\n' +
      'Map pin (example): 52.2297, 21.0122 (Vistula River, Warsaw, PL)\n' +
      'Common habitat: Lakes, rivers, coasts, fields near water (Europe, Asia)\n' +
      'Size: 35–39 cm; wingspan 86–99 cm\n' +
      'Detailed description:\n' +
      'A lively gull with a chocolate-brown hood in breeding season and a white head in winter (often with a dark ear spot). Agile in flight, it hovers and dips to grab food from the surface. It gathers in noisy flocks and changes plumage seasonally—perfect for notes about timing, behavior, and flock size.',
  },
  {
    id: '14',
    title: 'Common Moorhen',
    body:
      'Scientific name: Gallinula chloropus\n' +
      'Map pin (example): 41.0082, 28.9784 (Parks and canals, Istanbul, TR)\n' +
      'Common habitat: Reedy ponds, lakes, canals, slow rivers (Europe, Africa, Asia)\n' +
      'Size: 30–38 cm; wingspan 50–55 cm\n' +
      'Detailed description:\n' +
      'A dark waterbird with a bright red bill tipped yellow and long greenish legs. It walks along floating vegetation and reed edges, often flicking its white undertail. Moorhens feed on plants and small animals and are frequently seen in family groups. They can be bold in city parks, making them a consistent “collection staple.”',
  },
  {
    id: '15',
    title: 'Great Cormorant',
    body:
      'Scientific name: Phalacrocorax carbo\n' +
      'Map pin (example): 55.6761, 12.5683 (Coastal waters, Copenhagen, DK)\n' +
      'Common habitat: Coasts, estuaries, large lakes and rivers (Europe, Asia, North America)\n' +
      'Size: 80–100 cm; wingspan 130–160 cm\n' +
      'Detailed description:\n' +
      'A large dark diver with a hooked bill, often seen swimming low and then drying wings spread wide on posts after fishing. It hunts fish underwater with powerful kicks and surfaces with prey before swallowing it headfirst. Breeding adults may show pale thigh patches and a glossier look. The wing-drying pose is iconic and very “photo-log friendly.”',
  },
];
