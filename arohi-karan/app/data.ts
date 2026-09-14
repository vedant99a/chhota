/** Step 0 facts. Every date, time, venue, theme and dress code comes from here. */

export const COUNTDOWN_TARGET = '2027-02-02T12:00:00+05:30'

export const VENUE = {
  name: 'The Raj Palace, Jaipur',
  address: 'Jorawer Singh Gate, Amer Road, Jaipur 302002, Rajasthan, India',
  site: 'https://rajpalace.com',
  phone: '+91 141 2634077',
  tel: '+911412634077',
  lat: 26.9356705,
  lng: 75.8341016,
}

export type Event = {
  slug: string
  name: string
  time: string
  venue: string
  theme?: string
  dress: string[]
  image: string
  body: string
}

export const DAY_ONE: Event[] = [
  {
    slug: 'haldi',
    name: 'Haldi Lunch',
    time: '12:00 to 15:00',
    venue: 'Shahi Bagh',
    theme: 'Peachy Blossom',
    dress: ['Indo western', 'Pastels', 'No yellow'],
    image: '/assets/events/haldi.jpg',
    body: 'The first ritual of the wedding, and the gentlest. Turmeric, sandalwood and rose are blended into a paste and pressed onto the bride and groom by the people who love them best, a blessing for bright skin and brighter fortune. We are trading the traditional marigold for peach and blush, so come in soft pastels and leave the yellow at home. Lunch follows, long and unhurried, in the garden.',
  },
  {
    slug: 'welcome-dinner',
    name: 'Welcome Dinner',
    time: '19:00 onwards',
    venue: 'Maharani Bagh',
    theme: 'Gilded Glamour',
    dress: ['Black tie', 'Black tuxedos', 'Glamorous gowns'],
    image: '/assets/events/welcome-dinner.jpg',
    body: 'The palace opens its doors. An evening beneath the chandeliers where the people who raised us and the people who chose us will take the microphone, tell the stories we have been dreading, and then hand the night over to the music. Black tie, and no restraint.',
  },
]

export const DAY_TWO: Event[] = [
  {
    slug: 'sehrabandi',
    name: 'Sehrabandi',
    time: '11:00',
    venue: 'Motichowk',
    dress: ['Avant garde Indian ethnic'],
    image: '/assets/events/sehrabandi.jpg',
    body: 'Before the groom leaves for his wedding, his family gathers to tie the sehra, a veil of flowers and pearls, to his turban. Every knot is a blessing, offered by hand. It is the quietest ceremony of the two days, a last still moment before the celebration spills out into the courtyards.',
  },
  {
    slug: 'baraat',
    name: 'Baraat',
    time: '12:00',
    venue: 'Shahi Bagh',
    dress: [],
    image: '/assets/events/baraat.jpg',
    body: "The groom's procession, and it has no intention of being subtle. Dhol, brass, a horse in gold, rose petals, and every person who loves Karan dancing him to the gates. Arriving on time is optional. Arriving loudly is not.",
  },
  {
    slug: 'pheras',
    name: 'Pheras',
    time: '14:00',
    venue: 'Chaar Bagh',
    dress: [],
    image: '/assets/events/pheras.jpg',
    body: 'Beneath a canopy in the garden, Arohi and Karan will circle a sacred fire seven times. Each round carries a vow: for nourishment, for strength, for prosperity, for happiness, for family, for the long seasons of a life together, and for friendship. By the seventh, they are married.',
  },
  {
    slug: 'soiree',
    name: 'The Ballroom Soirée',
    time: '20:00 onwards',
    venue: 'Mehfil Mahal',
    theme: 'Ballroom glamour',
    dress: ['Ballroom glamour', 'Contemporary Indian couture'],
    image: '/assets/events/soiree.jpg',
    body: 'As day turns to dusk, the celebration moves inside the palace walls. Join us beneath the chandeliers for an evening of toasts, high energy revelry and fine dining.',
  },
]

export const ALL_EVENTS = [...DAY_ONE, ...DAY_TWO]

export const WARDROBE = [
  { event: 'Haldi Lunch', code: 'Indo western, pastels', steer: 'Peach, blush, ivory, sage. No yellow.' },
  { event: 'Welcome Dinner', code: 'Black tie', steer: 'Black tuxedos. Gowns, and go big.' },
  { event: 'Sehrabandi', code: 'Avant garde Indian ethnic', steer: 'Traditional, but make it yours.' },
  { event: 'Baraat', code: 'Festive Indian', steer: 'Something you can dance in, outdoors, at noon.' },
  { event: 'Pheras', code: 'Indian formal', steer: 'Daytime ceremony, garden setting.' },
  { event: 'The Ballroom Soirée', code: 'Ballroom glamour', steer: 'Contemporary Indian couture.' },
]
