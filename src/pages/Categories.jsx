// src/pages/Categories.jsx
import { useState, useEffect, Fragment } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/axiosClient';
import { useCategories, keys as categoryKeys } from '@/queries/useCategories';
import { useAuthContext } from '@/contexts/AuthContext';

import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import AnimatedPage from '@/components/AnimatedPage';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ButtonGroup } from '@mui/material';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Zoom from '@mui/material/Zoom';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import PageviewIcon from '@mui/icons-material/Pageview';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import CheckIcon from '@mui/icons-material/Check';

import { toast } from 'react-toastify';
import SearchBar from '@/components/ui/SearchFilter';
import Cherries from '@/images/cherries.jpg';
import BreadcrumbsNav from '@/components/ui/BreadcrumbsNav';
import AppBreadcrumbs from '@/components/ui/AppBreadcrumbs';

export default function Categories() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuthContext();

  const catsQ = useCategories(false, { enabled: true, retry: false });
  const categories = catsQ.data || [];

  const archiveMutation = useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/category/archive/${id}`, { archived: true });
      return data;
    },
    onSuccess: () => {
      toast.success('Category archived');
      // invalidate all flavors of categories (list + archived flag)
      qc.invalidateQueries({ queryKey: categoryKeys.all, exact: false }); // or categoryKeys.list(false)
      handleClose();
    },
    onError: (err) => {
      const msg = err?.response?.data?.error || 'Failed to archive category';
      toast.error(msg);
    },
  });

  // --- local UI state (always called) ---
  const [open, setOpen] = useState(false);
  const [deleteCurrentCategory, setDeleteCurrentCategory] = useState(null);
  const [showDescription, setShowDescription] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  const handleClose = () => setOpen(false);
  const deleteHandler = (_, id) => {
    setDeleteCurrentCategory(id);
    setOpen(true);
  };

  // search/sort derived list
  useEffect(() => {
    const source = Array.isArray(catsQ.data) ? catsQ.data : [];
    const filtered = source
      .slice()
      .sort((a, b) =>
        (a.category_name || a.category || '').localeCompare(b.category_name || b.category || ''),
      )
      .filter((c) =>
        (c.category_name || c.category || '').toLowerCase().includes(search.toLowerCase()),
      );
    setFilteredCategories(filtered);
  }, [search, catsQ.data]);

  const onSearchChange = (q) => setSearch(q);
  const handleClearClick = () => setSearch('');

  // modal style (constant object is fine)
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  // ⤵️ right after hooks/state/effects
  if (catsQ.isLoading) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="xl">
          <Box sx={{ mt: 8 }}>Loading categories…</Box>
        </Container>
      </AnimatedPage>
    );
  }

  if (catsQ.error) {
    return (
      <AnimatedPage>
        <Container component="main" maxWidth="xl">
          <Box sx={{ mt: 8, color: 'error.main' }}>Failed to load categories</Box>
        </Container>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <Container component="main" maxWidth="xl">
        <Grid
          sx={{
            mt: 8,
            mb: 4,
            minHeight: 'calc(100vh - 375px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <AppBreadcrumbs
            center
            segmentsMap={{
              admin: 'Admin',
              almanac: 'Almanac',
              plants: 'Plants',
              events: 'Events',
              categories: { label: 'Categories', to: '/categories' },
              add: 'Add',
              edit: 'Edit',
              view: 'View',
            }}
          />

          <h1>Categories</h1>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            {/* Left image */}
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Fade in timeout={2000}>
                <Box
                  component="img"
                  sx={{ maxWidth: '100%', height: 'auto' }}
                  alt="image"
                  src={Cherries}
                />
              </Fade>
            </Grid>

            {/* Center table + actions */}
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ width: '100%' }}>
                {/* <Box sx={{ justifyContent: 'center', mb: 1 }}>
                  <Button size="small" onClick={() => navigate('/almanac')}>
                    Back to Almanac
                  </Button>
                </Box> */}

                <Stack direction="row" sx={{ justifyContent: 'center' }} spacing={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      '& > *': { m: 1 },
                    }}
                  >
                    <ButtonGroup
                      variant="outlined"
                      color="secondary"
                      size="small"
                      aria-label="small button group"
                    >
                      <Button onClick={() => navigate('/plants')}>Plants</Button>
                      <Button onClick={() => navigate('/events')}>Events</Button>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/category/add')}
                      >
                        Category
                      </Button>
                    </ButtonGroup>
                  </Box>
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <SearchBar
                    found={filteredCategories}
                    helpertext="Search: Category Name"
                    placeholder="Search Categories"
                    onSearch={onSearchChange}
                    value={search}
                    handleClearClick={handleClearClick}
                  />
                </Box>
              </Box>

              <Zoom in timeout={1000}>
                <TableContainer sx={{ maxWidth: 650 }}>
                  <Table sx={{ width: 'max-content', mt: 4, mx: 'auto' }} size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell />
                        <TableCell>#</TableCell>
                        <TableCell align="left">Category</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredCategories.map((row, idx) => (
                        <Fragment key={row._id}>
                          <TableRow>
                            <TableCell>
                              <IconButton
                                aria-label="expand row"
                                size="small"
                                onClick={() =>
                                  setShowDescription((cur) => (cur === row._id ? false : row._id))
                                }
                              >
                                {showDescription === row._id ? (
                                  <KeyboardArrowUpIcon />
                                ) : (
                                  <KeyboardArrowDownIcon />
                                )}
                              </IconButton>
                            </TableCell>
                            <TableCell>{idx + 1}</TableCell>
                            <TableCell align="left">{row.category_name || row.category}</TableCell>
                            <TableCell align="center">
                              <Stack
                                direction="row"
                                spacing={2}
                                sx={{ justifyContent: 'flex-end' }}
                              >
                                <IconButton
                                  size="small"
                                  aria-label="view"
                                  color="info"
                                  onClick={() => navigate(`/category/${row._id}`, { state: row })}
                                >
                                  <PageviewIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  aria-label="edit"
                                  sx={{ color: 'secondary.main' }}
                                  onClick={() =>
                                    navigate(`/category/edit/${row._id}`, { state: row })
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  size="small"
                                  aria-label="delete"
                                  sx={{ color: 'grey.700' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteHandler(e, row._id);
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                              <Collapse
                                in={showDescription === row._id}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box sx={{ m: 1 }}>
                                  <Table size="small">
                                    <TableBody>
                                      <TableRow>
                                        <TableCell
                                          sx={{
                                            maxWidth: 310,
                                            borderBottom: 'none',
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            p: 0,
                                          }}
                                        >
                                          {row.description}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                        </Fragment>
                      ))}
                    </TableBody>

                    {/* Confirm modal */}
                    <Modal open={open} onClose={handleClose}>
                      <Box sx={modalStyle}>
                        <Typography variant="h6">Are you sure?</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Button
                              fullWidth
                              variant="contained"
                              color="secondary"
                              sx={{ mt: 3, mb: 2 }}
                              onClick={handleClose}
                            >
                              Cancel
                            </Button>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Button
                              fullWidth
                              variant="contained"
                              color="error"
                              sx={{ mt: 3, mb: 2 }}
                              onClick={() => archiveMutation.mutate(deleteCurrentCategory)}
                              disabled={archiveMutation.isPending}
                            >
                              {archiveMutation.isPending ? 'Deleting…' : 'Delete'}
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Modal>
                  </Table>
                </TableContainer>
              </Zoom>
            </Grid>

            {/* Right tips */}
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Fade in timeout={2000}>
                <Box sx={{ width: '100%', mt: 4 }}>
                  <Box align="center">
                    <TipsAndUpdatesIcon sx={{ color: 'secondary.main', fontSize: 36 }} />
                  </Box>
                  <Typography variant="h3" align="center" sx={{ color: 'secondary.dark' }}>
                    Tips
                  </Typography>
                  <List>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Categories group events"
                        secondary="Think about the events and what categories you might need. You’ll select the category when creating an event."
                      />
                    </ListItem>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <CheckIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="Categories represent actions"
                        secondary="Planting, weeding, sowing, fertilising, pruning, harvesting, spraying, etc."
                      />
                    </ListItem>
                  </List>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </AnimatedPage>
  );
}
