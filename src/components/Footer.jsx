// src/components/Footer.jsx
import { Box, Container, Link, Typography } from '@mui/material';
import dayjs from '@/utils/dayjsConfig';
import { useAuthContext } from '@/contexts/AuthContext';
import useAppLocation from '@/hooks/useAppLocation'; // saved coords -> IP fallback
import useWeatherNow from '@/hooks/useWeatherNow'; // Open-Meteo fetcher
import { iconForWmo } from '@/utils/weatherIcons';

const BASE_LINKS = [
  { label: 'Contact', href: '/contact' },
  { label: 'FAQ', href: '/faq' },
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '/privacy' },
  // last item is auth-dependent
];

export default function Footer() {
  const { user, signout } = useAuthContext();
  const isAuth = !!user;

  // location + weather (only enhance when signed-in; otherwise skip the call)
  const { coords, ready } = useAppLocation();
  const wx = useWeatherNow(isAuth && ready ? coords : null);

  const timeStr = dayjs().format('h:mm a'); // e.g. "8:09 am"
  const year = dayjs().year();

  // choose right-side string
  const icon = isAuth && wx?.code != null ? iconForWmo(wx.code) : null;
  const tempPart =
    isAuth && wx?.tempC != null ? `${icon ? `${icon} ` : ''}${Math.round(wx.tempC)}°C • ` : '';

  // build links with auth-aware last item
  const links = isAuth
    ? [...BASE_LINKS, { label: 'Sign Out', href: '#', onClick: signout }]
    : [...BASE_LINKS, { label: 'Sign In', href: '/signin' }];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'grey.400',
        py: 1.25,
        mt: 0,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'center' },
          justifyContent: 'space-between',
          gap: 1,
          textAlign: { xs: 'center', sm: 'left' },
          pb: { xs: 2 },
        }}
      >
        {/* LEFT: inline links with separators */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            rowGap: 0.5,
          }}
        >
          {links.map((l, i) => (
            <Box key={l.label} sx={{ display: 'inline-flex', alignItems: 'center' }}>
              {l.action === 'signout' ? (
                <Link
                  component="button"
                  onClick={signout}
                  underline="hover"
                  color="inherit"
                  variant="body2"
                  sx={{
                    lineHeight: 1.5,
                    cursor: 'pointer',
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  }}
                >
                  {l.label}
                </Link>
              ) : (
                <Link
                  href={l.href}
                  underline="hover"
                  color="inherit"
                  variant="body2"
                  sx={{
                    lineHeight: 1.8,
                    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
                  }}
                >
                  {l.label}
                </Link>
              )}
              {i < links.length - 1 && (
                <Box
                  component="span"
                  sx={{
                    mx: 1,
                    opacity: 0.4,
                    // pb: 4,
                    // fontSize: { xs: '0.5rem', sm: '0.8rem', md: '0.875rem' },
                  }}
                >
                  |
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* RIGHT: weather/time/app — stacks under links on mobile */}
        <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              whiteSpace: 'nowrap',
            }}
            aria-label="footer meta"
          >
            {tempPart}
            {timeStr} • Garden Almanac ® {year}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
