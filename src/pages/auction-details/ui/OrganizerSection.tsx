import CallIcon from '@mui/icons-material/CallOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import { Link, Stack, Typography } from '@mui/material'
import type { AuctionShowResponse, Contact } from '@entities/auction'
import { IconText, RestrictedField, SectionCard } from '@shared/ui'

interface OrganizerSectionProps {
  organizer: AuctionShowResponse['organizer']
  contacts: Contact[]
  hideContacts: boolean
}

export function OrganizerSection({ organizer, contacts, hideContacts }: OrganizerSectionProps) {
  return (
    <SectionCard title="Организатор">
      <Stack spacing={1.5}>
        <Typography variant="body1">{organizer.organization_name}</Typography>
        <Typography variant="body2" color="text.secondary">
          ИНН {organizer.organization_inn} · КПП {organizer.organization_kpp}
        </Typography>

        {hideContacts ? (
          <RestrictedField reason="Адрес и контакты станут доступны после подтверждения сделки" />
        ) : contacts.length > 0 ? (
          <Stack spacing={1}>
            {contacts.map((contact) => (
              <Stack key={contact.uid ?? contact.phone ?? contact.name} spacing={0.5}>
                {contact.name && <Typography variant="body2">{contact.name}</Typography>}
                {contact.phone && (
                  <IconText icon={<CallIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}>
                    <Link href={`tel:${contact.phone}`} color="inherit" underline="hover">
                      {contact.phone}
                    </Link>
                  </IconText>
                )}
                {contact.email && (
                  <IconText
                    icon={<EmailOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />}
                  >
                    <Link href={`mailto:${contact.email}`} color="inherit" underline="hover">
                      {contact.email}
                    </Link>
                  </IconText>
                )}
              </Stack>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Контакты не указаны
          </Typography>
        )}
      </Stack>
    </SectionCard>
  )
}
