import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  return (
    <ContentSection
      title='Account'
      desc='Ganti password akun admin. Setelah berhasil, kamu perlu login kembali.'
    >
      <AccountForm />
    </ContentSection>
  )
}
