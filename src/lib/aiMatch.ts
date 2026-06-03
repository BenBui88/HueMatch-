export interface ColorMatch {
  name: string
  brand: string
  hex: string
  match: number
  reason: string
  skinReason: string
}

export function getThinkingStep(index: number, outfitHex: string, skinName: string): string {
  const steps = [
    `Reading outfit color ${outfitHex}...`,
    `Analyzing skin tone — ${skinName}...`,
    'Applying color harmony theory...',
    'Filtering salon inventories near you...',
    'Ranking by combined match score...',
  ]
  return steps[index] ?? steps[steps.length - 1]
}

export async function getColorMatches(
  outfitHex: string,
  skinName: string,
  skinHex: string,
  undertone: string,
  nailType: string
): Promise<ColorMatch[]> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `You are a professional nail colorist. Outfit: ${outfitHex}. Skin tone: ${skinName} (${undertone} undertone, hex: ${skinHex}). Nail type: ${nailType}. Return ONLY a JSON array of 6 shades: [{"name":"...","brand":"...","hex":"#xxxxxx","match":95,"reason":"outfit reason","skinReason":"skin reason"}]. Real brands only. Sort by match descending.`
      }],
    }),
  })
  const data = await response.json()
  const text = data.content[0].text.trim().replace(/```json|```/g, '').trim()
  return JSON.parse(text) as ColorMatch[]
}

export function getFallbackMatches(nailType: string): ColorMatch[] {
  const fallbacks: Record<string, ColorMatch[]> = {
    Gel: [
      { name: 'Lavender Dusk',   brand: 'OPI GelColor', hex: '#9B7DB8', match: 97, reason: 'Analogous purple harmonizes beautifully.', skinReason: 'Cool lavender brightens warm complexions.' },
      { name: 'Berry Whisper',   brand: 'Gelish',        hex: '#8B5B8E', match: 93, reason: 'Deeper tone extends the palette.',         skinReason: 'Rich berry adds depth against medium skin.' },
      { name: 'Plum Poetry',     brand: 'CND Shellac',   hex: '#6E4A7A', match: 89, reason: 'Jewel tone adds richness.',               skinReason: 'Deep plum creates striking contrast.' },
      { name: 'Mauve Mist',      brand: 'Entity',        hex: '#B89AB8', match: 85, reason: 'Dusty, tonal and elegant.',               skinReason: 'Universally flattering across skin tones.' },
      { name: 'Lilac Dream',     brand: 'IBD',           hex: '#C2A8D4', match: 80, reason: 'Lighter tint, airy coordination.',        skinReason: 'Brightens fair and medium complexions.' },
      { name: 'Orchid Haze',     brand: 'Orly',          hex: '#B090C0', match: 75, reason: 'Neutral purple, seamless bridge.',        skinReason: 'Soft on all skin tones.' },
    ],
    Regular: [
      { name: 'Violet Hour',     brand: 'OPI',           hex: '#8B6BAE', match: 96, reason: 'Classic analogous match.',               skinReason: 'Medium purple is universally flattering.' },
      { name: 'Mystical Mauve',  brand: 'Essie',         hex: '#9E7DA8', match: 91, reason: 'Muted violet, no competition.',          skinReason: 'Complements warm and neutral undertones.' },
      { name: 'Grape Escape',    brand: 'Sally Hansen',  hex: '#7A5490', match: 87, reason: 'Mid-tone ties the look.',                skinReason: 'Flatters medium to deep skin.' },
      { name: 'Lavender Fields', brand: 'Zoya',          hex: '#B8A0CC', match: 83, reason: 'Soft pastel, fresh coordination.',       skinReason: 'Enhances natural glow on fair skin.' },
      { name: 'Purple Rain',     brand: 'China Glaze',   hex: '#6B4A8C', match: 78, reason: 'Bold deeper tone.',                     skinReason: 'Pops beautifully on deeper skin tones.' },
      { name: 'Orchid Haze',     brand: 'Butter London', hex: '#C0A0C8', match: 73, reason: 'Chic and understated.',                 skinReason: 'Elegant across all complexions.' },
    ],
    SNS: [
      { name: 'Wisteria',        brand: 'SNS Signature', hex: '#9B7DC0', match: 95, reason: 'Perfect tonal match.',                  skinReason: 'Beautiful harmony on all skin tones.' },
      { name: 'Violet Mist',     brand: 'Kiara Sky',     hex: '#8A6BAA', match: 90, reason: 'Cool-toned, enhances undertones.',      skinReason: 'Complements warm medium skin.' },
      { name: 'Purple Haze',     brand: 'Revel Nail',    hex: '#7058A0', match: 86, reason: 'Harmonious mid-purple.',               skinReason: 'Universally wearable.' },
      { name: 'Amethyst',        brand: 'SNS Natural',   hex: '#6A4890', match: 82, reason: 'Jewel-toned depth.',                   skinReason: 'Brings out warm undertones.' },
      { name: 'Dusty Plum',      brand: 'Gelish Dip',    hex: '#8B6080', match: 77, reason: 'Understated muted plum.',              skinReason: 'Adds refinement to any complexion.' },
      { name: 'Heather',         brand: 'DND DC',        hex: '#B090C0', match: 72, reason: 'Neutral bridge.',                      skinReason: 'Soft and elegant on all skin tones.' },
    ],
  }
  return fallbacks[nailType] ?? fallbacks.Gel
}
