import ReviewBanner from './components/ReviewBanner'
import ScrollHero from './components/ScrollHero'
import StickyRsvp from './components/StickyRsvp'
import Countdown from './components/Countdown'
import OurStory from './components/OurStory'
import Families from './components/Families'
import Celebrations from './components/Celebrations'
import Venue from './components/Venue'
import Stay from './components/Stay'
import Travel from './components/Travel'
import Weather from './components/Weather'
import Wardrobe from './components/Wardrobe'
import Rsvp from './components/Rsvp'
import Closing from './components/Closing'

export default function Page() {
  return (
    <main style={{ background: 'var(--ivory)' }}>
      <ReviewBanner />
      <ScrollHero />
      <StickyRsvp />
      <Countdown />
      <OurStory />
      <Families />
      <Celebrations />
      <Venue />
      <Stay />
      <Travel />
      <Weather />
      <Wardrobe />
      <Rsvp />
      <Closing />
    </main>
  )
}
