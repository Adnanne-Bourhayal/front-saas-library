import commonStyles from '../patterns/base.css?raw'
import license from '../LICENSE?raw'

export type Pattern = {
  id: string
  name: string
  category: string
  description: string
  instructions: string
  integration: string
  icon: string
}

export const patterns: Pattern[] = [
  {
    id: 'member-directory',
    name: 'Member directory',
    category: 'Data display',
    icon: 'members',
    description:
      'A searchable team list with role labels and an invitation-status filter.',
    instructions:
      'Search for a role, then filter the results by invitation status.',
    integration:
      'Replace the sample rows with your team data. The visible count is calculated from the rows.',
  },
  {
    id: 'billing-cycle',
    name: 'Plan calculator',
    category: 'Billing',
    icon: 'billing',
    description:
      'Show a seat-based price and the amount due at each billing interval.',
    instructions:
      'Switch billing periods or change the number of seats to compare totals.',
    integration:
      'Set your per-seat rates and currency in the calculation. Connect purchases to a server-side checkout.',
  },
  {
    id: 'first-project',
    name: 'First project',
    category: 'Onboarding',
    icon: 'project',
    description:
      'An empty workspace that turns into a project list after the first creation.',
    instructions:
      'Enter a project name and submit to see the empty state become a list.',
    integration:
      'Save created projects through your own API before confirming them in production.',
  },
  {
    id: 'setup-checklist',
    name: 'Setup checklist',
    category: 'Onboarding',
    icon: 'check',
    description:
      'A three-step onboarding checklist with a live completion indicator.',
    instructions: 'Check and uncheck the steps to update the progress bar.',
    integration:
      'Replace the setup steps with your workflow and store completion in the user profile.',
  },
  {
    id: 'usage-meter',
    name: 'Usage meter',
    category: 'Billing',
    icon: 'meter',
    description:
      'A storage meter with explicit remaining capacity and a near-limit state.',
    instructions:
      'Move the slider towards the limit to preview each capacity state.',
    integration:
      'Set the capacity from your plan and replace the preview slider with measured usage.',
  },
  {
    id: 'notification-preferences',
    name: 'Notification settings',
    category: 'Settings',
    icon: 'settings',
    description:
      'A settings form that distinguishes pending edits from saved preferences.',
    instructions: 'Change a preference, then save it or discard the edits.',
    integration:
      'Wire the save action to your endpoint and report success only after persistence succeeds.',
  },
]

const sources = import.meta.glob<string>('../patterns/*.html', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/** The iframe, code viewer and clipboard always use the same self-contained source. */
export function sourceFor(id: string) {
  const template = sources['../patterns/' + id + '.html']
  if (!template) throw Error('Unknown pattern')
  return (
    template.trim() +
    '\n<style>\n' +
    commonStyles.trim() +
    '\n</style>\n<!--\n' +
    license.trim() +
    '\n-->\n'
  )
}
