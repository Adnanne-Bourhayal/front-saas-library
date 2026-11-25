import commonStyles from '../patterns/base.css?raw'
import license from '../LICENSE?raw'

export const categories = [
  'Data display',
  'Billing',
  'Onboarding',
  'Settings',
] as const
type Category = (typeof categories)[number]

export type Pattern = {
  id: string
  name: string
  category: Category
  mat: string
  instructions: string
  integration: string
}

export const patterns: Pattern[] = [
  {
    id: 'activity-pulse',
    name: 'Activity pulse',
    category: 'Data display',
    mat: 'amethyst',
    instructions:
      'Switch between weekly and monthly activity to compare the bars.',
    integration:
      'Replace the two sample series with your totals and update the period labels.',
  },
  {
    id: 'member-directory',
    name: 'Member directory',
    category: 'Data display',
    mat: 'fern',
    instructions:
      'Search for a name or role, then narrow the list by invitation status.',
    integration:
      'Replace the sample rows with your team. The count follows the visible members.',
  },
  {
    id: 'release-stream',
    name: 'Release timeline',
    category: 'Data display',
    mat: 'clay',
    instructions: 'Open a release to read what changed.',
    integration:
      'Use a details element per release and a time element for its date.',
  },
  {
    id: 'billing-cycle',
    name: 'Plan calculator',
    category: 'Billing',
    mat: 'denim',
    instructions:
      'Change the seat count and billing interval to compare totals.',
    integration:
      'Set the rates and currency in the calculator; use a server-side checkout for actual purchases.',
  },
  {
    id: 'invoice-slip',
    name: 'Invoice slip',
    category: 'Billing',
    mat: 'mustard',
    instructions:
      'Switch invoices to see their line items, total and payment status.',
    integration:
      'Replace the sample invoices with records from your billing service.',
  },
  {
    id: 'usage-meter',
    name: 'Storage allowance',
    category: 'Billing',
    mat: 'graphite',
    instructions:
      'Move the usage slider to explore remaining capacity and the limit.',
    integration:
      'Read the limit from your plan and supply measured usage instead of a demo slider.',
  },
  {
    id: 'first-project',
    name: 'First project',
    category: 'Onboarding',
    mat: 'blush',
    instructions: 'Name your first project and add it to the workspace.',
    integration:
      'Save the new project in your application before confirming success.',
  },
  {
    id: 'setup-checklist',
    name: 'Setup checklist',
    category: 'Onboarding',
    mat: 'sage',
    instructions:
      'Complete or undo the three steps and watch the progress update.',
    integration:
      'Use steps that match your workflow and persist completion in the user profile.',
  },
  {
    id: 'workspace-tour',
    name: 'Workspace tour',
    category: 'Onboarding',
    mat: 'orchid',
    instructions: 'Move through three illustrated steps using Next and Back.',
    integration:
      'Use one slide for each step and connect the finish action to your onboarding flow.',
  },
  {
    id: 'notification-preferences',
    name: 'Notification settings',
    category: 'Settings',
    mat: 'silt',
    instructions: 'Change a preference, then save it or discard your edits.',
    integration:
      'Connect the save action to your endpoint and confirm success after persistence.',
  },
  {
    id: 'reading-mode',
    name: 'Reading preferences',
    category: 'Settings',
    mat: 'cobalt',
    instructions:
      'Adjust text size and theme, then inspect the reading sample.',
    integration:
      'Apply the same preferences to your content and store them with the user profile.',
  },
  {
    id: 'week-planner',
    name: 'Working days',
    category: 'Settings',
    mat: 'melon',
    instructions:
      'Choose the days your team works and see the weekly schedule update.',
    integration:
      'Start with your saved working days and persist changes with the appropriate time zone.',
  },
]

const html = import.meta.glob<string>('../patterns/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const themes = import.meta.glob<string>('../patterns/themes/*.css', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/** Gallery thumbnails, live previews and copies use the same HTML, CSS and behavior. */
export function sourceFor(id: string) {
  const example = html['../patterns/' + id + '.html']
  if (!example) throw new Error('Unknown pattern')
  const theme = themes['../patterns/themes/' + id + '.css']
  return [
    example.trim(),
    '<style>',
    commonStyles.trim(),
    theme.trim(),
    '</style>',
    '<!--',
    license.trim(),
    '-->',
    '',
  ].join('\n')
}
