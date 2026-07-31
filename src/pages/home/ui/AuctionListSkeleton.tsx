import { List, ListItem, Skeleton, Stack } from '@mui/material'
import { SKELETON_ITEM_COUNT } from '../model/constants'

export function AuctionListSkeleton() {
  return (
    <List sx={{ width: '100%' }}>
      {Array.from({ length: SKELETON_ITEM_COUNT }, (_, index) => (
        <ListItem
          key={index}
          divider
          sx={{
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: { xs: 1, sm: 2 },
            py: 2,
          }}
        >
          <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Skeleton animation="wave" variant="text" width="40%" sx={{ fontSize: '1rem' }} />
              <Skeleton animation="wave" variant="rounded" width={72} height={24} />
            </Stack>
            <Skeleton animation="wave" variant="text" width="70%" />
          </Stack>
          <Skeleton
            animation="wave"
            variant="rounded"
            width={96}
            height={36}
            sx={{ alignSelf: { xs: 'stretch', sm: 'center' }, flexShrink: 0 }}
          />
        </ListItem>
      ))}
    </List>
  )
}
