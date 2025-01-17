import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import {
  TextField,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Tabs,
  Tab,
  Slider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Switch,
  IconButton,
} from '@mui/material';
import ComponentBlock from 'src/sections/_examples/component-block';
import Iconify from 'src/components/iconify';
import { MuiColorInput } from 'mui-color-input';
import { socketClient } from 'src/sections/all-themes/utils/helper-functions';
import LogoDealer, { VisuallyHiddenInput } from './logo-part';
import { useDispatch } from 'react-redux';
import { AppDispatch } from 'src/redux/store/store';
import { saveLogo } from 'src/redux/store/thunks/builder';
import Sketch from '@uiw/react-color-sketch';
import './style.css';
import NavbarTheme from 'src/sections/all-themes/component/NavbarTheme';
import { sections } from 'src/sections/all-themes/component/response';
// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'Layout',
    label: 'Layout',
  },
  {
    value: 'Style',
    label: 'Style',
  },
  {
    value: 'Components',
    label: 'Components',
  },
];
interface NavProps {
  themeConfig: {
    navLogoPosition: string;
  };
  handleThemeConfig: (key: string, value: any) => void; // Adjust 'value' type as needed
  mobile?: boolean;
  builder_Id: any;
}

export default function NavDealer({
  themeConfig,
  handleThemeConfig,
  mobile = false,
  builder_Id,
}: NavProps) {
  const [navbarState, setNavbarState] = useState(sections);
  const [currentTab, setCurrentTab] = useState('Layout');
  const [appBar, setAppBar] = useState<any>({});
  const [mainAppBar, setMainAppBar] = useState<any>({});
  const socket = socketClient();
  const dispatch = useDispatch<AppDispatch>();

  const debounce = (func: any, delay: any) => {
    let timeoutId: any;
    return (...args: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // useEffect(() => {
  //   if (socket) {
  //     socket.on(`${builder_Id}:cmd`, (data) => {
  //       console.log("response");

  //       console.log(JSON.stringify(data.result));
  //     });
  //   }
  // }, [builder_Id])

  const handleChangeEvent = (
    key: string,
    newValue: any,
    parentClass: string,
    subchild: string = ''
  ) => {
    let _socketKey = '';
    let valueToShare = '';

    if (subchild === 'mobileView') {
      const nestedAppbar = appBar?.[parentClass]?.[subchild] ?? {};
      setAppBar({
        ...appBar,
        [parentClass]: { [subchild]: { ...nestedAppbar, [key]: newValue } },
      });
    } else {
      const nestedAppbar = appBar?.[parentClass] ?? {};
      setAppBar({ ...appBar, [parentClass]: { ...nestedAppbar, [key]: newValue } });
    }

    _socketKey = parentClass ? parentClass + '.' + (subchild ? subchild + '.' : '') + key : key;
    // valueToShare = typeof newValue === 'number' ? `${newValue}px` : newValue;
    valueToShare = newValue;

    // const targetHeader = 'appBar.appBar.';
    const targetHeader = 'home.sections.appBar.';
    const data = {
      builderId: builder_Id,
      key: targetHeader + _socketKey,
      value: valueToShare,
    };

    console.log('data', data);

    if (socket) {
      socket.emit('website:cmd', data);
    }
  };

  const isColorValid = (color: string) =>
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$|^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, (0(\.\d{1,2})?|1(\.0{1,2})?)\)$|^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$|^hsla\(\d{1,3}, \d{1,3}%, \d{1,3}%, (0(\.\d{1,2})?|1(\.0{1,2})?)\)$/.test(
      color
    );
  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);
  const customPresets = [
    '#FF5733', // Reddish Orange
    '#33FF57', // Greenish Yellow
    '#3366FF', // Vivid Blue
    '#FF33FF', // Electric Purple
    '#33FFFF', // Cyan
    '#FF3366', // Pink
    '#6633FF', // Blue Purple
    '#FF9900', // Orange
    '#00FF99', // Spring Green
    '#9966FF', // Royal Purple
    '#99FF33', // Lime Green
    '#FF66CC', // Pastel Pink
    '#66FF33', // Bright Lime
    '#FF6600', // Bright Orange
    '#FF99CC', // Light Pink
    '#3399FF', // Sky Blue
    '#FFCC00', // Gold
    '#33CC66', // Jade
    '#33FF57', // Greenish Yellow
    '#3366FF', // Vivid Blue
  ];
  const handleImageChange64 = (key: string) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1]; // Get the base64 data
        // console.log('Base64:', base64); // Log the base64 data
        // setImagePreview(reader.result?.toString() || null);
        // handleThemeConfig(key, reader.result?.toString() || "");

        const newLogoObj = {
          ...appBar,
          logoObj: {
            ...appBar.logoObj,
            logo: reader.result?.toString(),
          },
        };
        setAppBar(newLogoObj);

        saveTempData(file);
      };

      reader.readAsDataURL(file); // Read the file as data URL
    } else {
      alert('Please select a valid image file.');
    }
  };
  const saveTempData = (file: any) => {
    const formDataToSend = new FormData();
    formDataToSend.append('image', file);

    dispatch(saveLogo({ builderId: builder_Id, data: formDataToSend })).then((response: any) => {
      // console.log("response", response);
    });
  };
  const [menus, setMenus] = useState([
    {
      link: '',
      name: '',
    },
  ]);

  useEffect(() => {
    const menuesList = menus.filter((menuObj: any) => menuObj.link !== '' && menuObj.name !== '');
    if (menuesList.length > 0) {
      sendSocketMsg(menuesList);
    }
  }, [menus]);

  const sendSocketMsg = debounce((menuesList: any) => {
    const targetHeader = 'home.sections.appBar.menu.';
    const _socketKey = 'menuItems';
    const valueToShare = menuesList;
    const data = {
      builderId: builder_Id,
      key: targetHeader + _socketKey,
      value: valueToShare,
    };
    if (socket) {
      socket.emit('website:cmd', data);
    }
  }, 1500);

  const [containerBackgroundColor, setContainerBackgrounColor] = useState(false);
  const [searchBackgroundColor, setSearchBackgroundColor] = useState(false);
  const [isMenu, setIsMenu] = useState(false);
  const [menuColors, setMenuColors] = useState({ textBackgroundColor: false, hoverColor: false });
  // Navbar
  const [generalIcons, setGeneralIcons] = useState(navbarState[0].generalIcons);
  const [appBarSearch, setAppBarSearch] = useState(navbarState[0].appBar.search);
  // console.log(generalIcons);
  const [appBarLogo, setAppBarLogo] = useState(navbarState[0]?.websiteLogo);

  const [appBarContainer, setAppBarContainer] = useState(navbarState[0].appBar.container);

  const [centerMenu, setCenterMenu] = useState(navbarState[0]?.appBar?.menu);
  const handleChangeMenu = (event: any, target: any, index: any) => {
    const updatedMenus = menus.map((menuItem, i) => {
      if (i === index) {
        return { ...menuItem, [target]: event.target.value };
      }
      return menuItem;
    });
    setMenus(updatedMenus);
    setCenterMenu((prev: any) => ({ ...prev, menuItems: updatedMenus }));
  };
  console.log(centerMenu);
  const dataCart = [
    {
      name: 'Cart 1',
      checked: false,
      icon: '/raw/cart3.svg',
      value: '1',
    },
    {
      name: 'Cart 2',
      checked: true,
      icon: '/raw/cart1.svg',
      value: '2',
    },
    {
      name: 'Cart 3',
      checked: false,
      icon: '/raw/cart2.svg',
      value: '3',
    },
    {
      name: 'Cart 4',
      checked: false,
      icon: '/raw/cart4.svg',
      value: '4',
    },
  ];
  const dataLeftHeader = [
    {
      name: 'Menu 1',
      checked: false,
      icon: 'heroicons-outline:menu-alt-2',
      value: '1',
    },
    {
      name: 'Menu 2',
      checked: true,
      icon: 'material-symbols:menu',
      value: '2',
    },
    {
      name: 'Menu 3',
      checked: false,
      icon: 'carbon:menu',
      value: '3',
    },
    {
      name: 'Menu 4',
      checked: false,
      icon: 'system-uicons:menu-vertical',
      value: '4',
    },
  ];
  const [cartLogo, setCartLogo] = useState('/raw/cart3.svg');
  const [headerLogo, setHeaderLogo] = useState('heroicons-outline:menu-alt-2');
  return (
    <div>
      <Stack
        spacing={1}
        sx={{
          width: 1,
          maxHeight: '700px',
          overflow: 'auto',
          scrollbarWidth: 'none', // Hide the scrollbar for firefox
          '&::-webkit-scrollbar': {
            display: 'none', // Hide the scrollbar for WebKit browsers (Chrome, Safari, Edge, etc.)
          },
          '&-ms-overflow-style:': {
            display: 'none', // Hide the scrollbar for IE
          },
        }}
      >
        <Stack border={5} borderColor={'#5cb85c'}>
          <NavbarTheme
            headerLogo={headerLogo}
            cartLogo={cartLogo}
            centerMenu={centerMenu}
            appBarContainer={appBarContainer}
            appBarLogo={appBarLogo}
            appBarSearch={appBarSearch}
            generalIcons={generalIcons}
            navbarState={navbarState}
          />
        </Stack>
        <Accordion
          sx={{
            width: '100%',
          }}
        >
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Container</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ p: 0 }}>
              <Stack direction="column" gap={2} alignItems="center" justifyContent="space-between">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width={'100%'}
                >
                  <Typography variant="caption" sx={{ fontWeight: 900 }}>
                    Appbar
                  </Typography>
                  <Switch
                    // checked={appBar?.container?.show}
                    onChange={(event: any, value: any) =>
                      handleChangeEvent('show', value, 'container')
                    }
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
                {appBar?.container?.show && (
                  <Stack width={'100%'}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        Shadow
                      </Typography>
                      <Switch
                        checked={appBar?.container?.isShadow}
                        onChange={(event: any, value: any) => {
                          handleChangeEvent('isShadow', value, 'container');
                          setAppBarContainer((prev) => ({ ...prev, isShadow: prev?.isShadow }));
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        Background Color
                      </Typography>
                      <Switch
                        checked={containerBackgroundColor}
                        onChange={(event: any, value: any) => {
                          setContainerBackgrounColor((pv) => !pv);
                          // setAppBarContainer((prev) => ({
                          //   ...prev,
                          //   backgroundColor: event ,
                          // }));
                          // console.log(value);
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>

                    {/* <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Show</Typography>
                                    <RadioGroup row value={appBar?.container?.show || "true"} onChange={(event: any) => handleChangeEvent('show', event?.target?.value, 'container')}>
                                        <FormControlLabel value="true" control={<Radio size="medium" />} label="true" />
                                        <FormControlLabel value="false" control={<Radio size="medium" />} label="false" />
                                    </RadioGroup>
                                </Box> */}
                    {/* <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Shadow</Typography>
                                    <RadioGroup row value={appBar?.container?.isShadow || "true"} onChange={(event: any) => handleChangeEvent('isShadow', event?.target?.value, 'container')}>
                                        <FormControlLabel value={"true"} control={<Radio size="medium" />} label="Show" />
                                        <FormControlLabel value={"false"} control={<Radio size="medium" />} label="Hide" />
                                    </RadioGroup>
                                </Box> */}

                    {containerBackgroundColor && (
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="caption" color="#8688A3">
                          Background Color
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent={'center'}
                          spacing="18px"
                          marginTop="10px"
                        >
                          {/* <MuiColorInput
                      sx={{ width: '100%', margin: 'auto' }}
                      variant="outlined"
                      value={appBar?.container?.backgroundColor ?? '#000001'}
                      format="hex"
                      onChange={(event) =>
                        isColorValid(event)
                          ? handleChangeEvent('backgroundColor', event, 'container')
                          : null
                      }
                    /> */}
                          <Sketch
                            onChange={(event: any) => {
                              isColorValid(event?.hex)
                                ? handleChangeEvent('backgroundColor', event?.hex, 'container')
                                : null;
                              setAppBarContainer((prev) => ({
                                ...prev,
                                backgroundColor: event?.hex,
                              }));
                            }}
                            presetColors={customPresets}
                            style={{ width: '100%' }}
                          />
                        </Stack>
                      </Box>
                    )}
                    {/* <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Background Color(Dark)</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                            value={appBar?.container?.backgroundColorDark ?? "#000001"}
                                            format="hex"
                                            onChange={event => isColorValid(event) ? handleChangeEvent('backgroundColorDark', event, 'container') : null}
                                        />
                                    </Stack>
                                </Box> */}
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="caption" color="#8688A3">
                        Border Bottom Width
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing="18px">
                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                          <Slider
                            // value={appBar?.container?.borderBottomWidth || 0}
                            onChange={(event: any, newValue: number | number[]) => {
                              handleChangeEvent('borderBottomWidth', newValue, 'container');
                              // console.log(_event);
                              setAppBarContainer((prev) => ({
                                ...prev,
                                borderBottomWidth: event?.target?.value,
                              }));
                            }}
                            valueLabelDisplay="auto"
                            min={0}
                            max={20}
                          />
                        </Stack>
                      </Stack>
                    </Box>
                    {appBar?.container?.borderBottomWidth > 0 && (
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="caption" color="#8688A3">
                          Border Bottom Color
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing="18px">
                          {/* <MuiColorInput
                      sx={{ width: '100%', margin: 'auto' }}
                      variant="outlined"
                      value={appBar?.container?.borderBottomColor ?? '#'}
                      format="hex"
                      // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, borderBottomColor: event }) : null}
                      onChange={(event) =>
                        isColorValid(event)
                          ? handleChangeEvent('borderBottomColor', event, 'container')
                          : null
                      }
                    /> */}
                          <Sketch
                            onChange={(event: any) => {
                              isColorValid(event?.hex)
                                ? handleChangeEvent('borderBottomColor', event?.hex, 'container')
                                : null;
                              setAppBarContainer((prev) => ({
                                ...prev,
                                borderBottomColor: event?.hex,
                              }));
                            }}
                            presetColors={customPresets}
                            style={{ width: '100%' }}
                          />
                        </Stack>
                      </Box>
                    )}

                    {/* <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Margin Bottom</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                            <Slider
                                                value={appBar?.container?.marginBottom || 0}
                                                onChange={(_event: Event, newValue: number | number[]) => handleChangeEvent('marginBottom', newValue, 'container', 'containerViewStyle')}
                                                valueLabelDisplay="auto"
                                                marks
                                                min={0}
                                                max={20}
                                            />
                                        </Stack>
                                    </Stack>
                                </Box> */}
                  </Stack>
                )}
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ width: '100%' }}>
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Logo</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ p: 0 }}>
              <Stack direction="column" gap={2} alignItems="start" justifyContent="space-between">
                {/* <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Show</Typography>
                                    <RadioGroup row value={appBar?.logoObj?.status || "true"} onChange={(event: any) => handleChangeEvent('status', event?.target?.value, 'logoObj')}>
                                        <FormControlLabel value="true" control={<Radio size="medium" />} label="true" />
                                        <FormControlLabel value="false" control={<Radio size="medium" />} label="false" />
                                    </RadioGroup>
                                </Box> */}

                <LogoDealer
                  appBarLogo={appBarLogo}
                  setAppBarLogo={setAppBarLogo}
                  themeConfig={{ logo: '', ...themeConfig }}
                  builderId={builder_Id}
                  handleThemeConfig={handleThemeConfig}
                />

                {/* <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3' mb={2}>Upload Image</Typography>
                                    <Box sx={{
                                        width: "80px",
                                        height: "80px",
                                        outline: "#EBEBF0 dashed 4px",
                                        borderRadius: "20px",
                                        display: 'flex',
                                        marginTop: "10px",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundImage: `url(${appBar?.logoObj?.logo})`,
                                        backgroundSize: '100% 100%',
                                    }} component="label" >

                                        <VisuallyHiddenInput type='file' onChange={handleImageChange64('logo')} />
                                        <Iconify icon='bi:image' style={{ color: '#C2C3D1', display: appBar?.logoObj?.logo ? 'none' : 'block' }} />
                                    </Box>
                                </Box>
                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Logo Text</Typography>
                                    <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                        <TextField variant='filled'
                                            type='text'
                                            fullWidth
                                            value={appBar?.logoObj?.text}
                                            onChange={event => handleChangeEvent('text', event.target.value, 'logoObj')}
                                        />
                                    </Stack>
                                </Box>

                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Text Background</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                            value={appBar?.logoObj?.textBg ?? "#000001"}
                                            format="hex"
                                            onChange={event => isColorValid(event) ? handleChangeEvent('textBg', event, 'logoObj') : null}
                                        />
                                    </Stack>
                                </Box>
                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Text Color</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                            value={appBar?.logoObj?.color ?? "#000001"}
                                            format="hex"
                                            onChange={event => isColorValid(event) ? handleChangeEvent('color', event, 'logoObj') : null}
                                        />
                                    </Stack>
                                </Box>
                                <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Border Width (%)</Typography>
                                    <Stack direction='row' alignItems='center' spacing='18px'>
                                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                            <Slider
                                                value={appBar?.logoObj?.borderWidth || 0}
                                                onChange={(_event: Event, newValue: number | number[]) => handleChangeEvent('borderWidth', newValue, 'logoObj')}
                                                valueLabelDisplay="auto"
                                                marks
                                                step={1}
                                                min={0}
                                                max={5}
                                            />
                                        </Stack>
                                    </Stack>
                                </Box>

                                <Box sx={{ width: "100%", display: 'flex', gap: 2 }} >
                                    <Box>
                                        <Typography variant='caption' color='#8688A3'>Width</Typography>
                                        <Stack direction='row' alignItems='center' spacing='18px'>
                                            <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                                <TextField variant='filled'
                                                    type='number'
                                                    value={appBar?.logoObj?.width}
                                                    onChange={event => handleChangeEvent('width', event.target.value, 'logoObj')}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Box>
                                    <Box>
                                        <Typography variant='caption' color='#8688A3'>Height</Typography>
                                        <Stack direction='row' alignItems='center' spacing='18px'>
                                            <Stack direction="row" alignItems="center" spacing={1} width={1}>
                                                <TextField variant='filled'
                                                    type='number'
                                                    value={appBar?.logoObj?.height}
                                                    onChange={event => handleChangeEvent('height', event.target.value, 'logoObj')}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Box>
                                </Box> */}
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ width: '100%' }}>
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Menu</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ width: '100%', my: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width={'100%'}
              >
                <Typography variant="caption" sx={{ fontWeight: 900 }}>
                  Add Menu
                </Typography>
                <Switch
                  checked={isMenu}
                  onChange={() => {
                    setIsMenu((pv) => !pv);
                    setCenterMenu((prev) => ({ ...prev, status: !prev.status }));
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Stack>
            </Box>
            {isMenu && (
              <Box sx={{ p: 0 }}>
                <Stack direction="column" gap={2} alignItems="start" justifyContent="space-between">
                  <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
                    {/* <Box>
                      <Typography variant="caption" color="#8688A3">
                        Size
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing="18px">
                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                          <TextField
                            variant="filled"
                            type="number"
                            value={appBar?.menu?.style?.size}
                            onChange={(event) =>
                              handleChangeEvent('size', event.target.value, 'menu', 'style')
                            }
                          />
                        </Stack>
                      </Stack>
                    </Box> */}
                  </Box>

                  <Stack width={'100%'}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="caption" color="#8688A3">
                        Text Color
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing="18px">
                        {/* <MuiColorInput
                      sx={{ width: '100%', margin: 'auto' }}
                      variant="outlined"
                      value={appBar?.logoObj?.color ?? '#000001'}
                      format="hex"
                      onChange={(event) =>
                        isColorValid(event) ? handleChangeEvent('color', event, 'logoObj') : null
                      }
                    /> */}
                        <Sketch
                          onChange={(event: any) => {
                            isColorValid(event?.hex)
                              ? handleChangeEvent('color', event?.hex, 'menu', 'style')
                              : null;
                            setCenterMenu((prev) => ({
                              ...prev,
                              style: {
                                ...prev.style,
                                color: event.hex,
                              },
                            }));
                          }}
                          presetColors={customPresets}
                          style={{ width: '100%' }}
                        />
                      </Stack>
                    </Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        Text Background Color
                      </Typography>
                      <Switch
                        checked={menuColors.textBackgroundColor}
                        onChange={(event: any, value: any) =>
                          setMenuColors((pv) => ({
                            ...pv,
                            textBackgroundColor: !pv.textBackgroundColor,
                          }))
                        }
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    {menuColors.textBackgroundColor && (
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="caption" color="#8688A3">
                          Text Background
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing="18px">
                          {/* <MuiColorInput
                      sx={{ width: '100%', margin: 'auto' }}
                      variant="outlined"
                      value={appBar?.logoObj?.textBg ?? '#000001'}
                      format="hex"
                      onChange={(event) =>
                        isColorValid(event) ? handleChangeEvent('textBg', event, 'logoObj') : null
                      }
                    /> */}
                          <Sketch
                            onChange={(event: any) => {
                              isColorValid(event?.hex)
                                ? handleChangeEvent('backgroundColor', event?.hex, 'menu', 'style')
                                : null;
                              setCenterMenu((prev) => ({
                                ...prev,
                                style: {
                                  ...prev.style,
                                  backgroundColor: event.hex,
                                },
                              }));
                            }}
                            presetColors={customPresets}
                            style={{ width: '100%' }}
                          />
                        </Stack>
                      </Box>
                    )}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        Hover Color
                      </Typography>
                      <Switch
                        checked={menuColors.hoverColor}
                        onChange={(event: any, value: any) =>
                          setMenuColors((pv) => ({ ...pv, hoverColor: !pv.hoverColor }))
                        }
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    {menuColors.hoverColor && (
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="caption" color="#8688A3">
                          Hover Color
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing="18px">
                          {/* <MuiColorInput
                      sx={{ width: '100%', margin: 'auto' }}
                      variant="outlined"
                      value={appBar?.logoObj?.textBg ?? '#000001'}
                      format="hex"
                      onChange={(event) =>
                        isColorValid(event) ? handleChangeEvent('textBg', event, 'logoObj') : null
                      }
                    /> */}
                          <Sketch
                            onChange={(event: any) => {
                              isColorValid(event?.hex)
                                ? handleChangeEvent('hoverColor', event?.hex, 'menu', 'style')
                                : null;
                              setCenterMenu((prev) => ({
                                ...prev,
                                style: {
                                  ...prev.style,
                                  hoverColor: event.hex,
                                },
                              }));
                            }}
                            presetColors={customPresets}
                            style={{ width: '100%' }}
                          />
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                  <Divider />
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">Menu</Typography>
                    <IconButton
                      onClick={() => setMenus((pv) => [...pv, { link: '', name: '' }])}
                      color="primary"
                    >
                      <Iconify icon="ic:baseline-plus" />
                    </IconButton>
                  </Box>
                  {/* Menu Start */}

                  {menus?.map((item: any, i) => (
                    <Box key={i} sx={{ width: '100%', display: 'flex', gap: 2 }}>
                      <Box>
                        <Typography variant="caption" color="#8688A3">
                          Link
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing="18px">
                          <Stack direction="row" alignItems="center" spacing={1} width={1}>
                            <TextField
                              variant="filled"
                              type="text"
                              placeholder="https://"
                              value={item.link}
                              onChange={(event) => handleChangeMenu(event, 'link', i)}
                              // onChange={(event) =>
                              //   // setMenus([...menus])
                              // }
                            />
                          </Stack>
                        </Stack>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="#8688A3">
                          Name
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing="18px">
                          <Stack direction="row" alignItems="center" spacing={1} width={1}>
                            <TextField
                              variant="filled"
                              type="text"
                              placeholder="Name"
                              value={item?.name}
                              onChange={(event) => handleChangeMenu(event, 'name', i)}
                            />
                          </Stack>
                        </Stack>
                      </Box>
                    </Box>
                  ))}
                  {/* Menu End */}
                </Stack>
              </Box>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ width: '100%' }}>
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Search</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ p: 0 }}>
              {/* <Box>
                                <Typography variant='caption' color='#8688A3'>
                                    Text
                                </Typography>
                                <Stack direction='column' gap={2} alignItems='start' justifyContent='space-between' sx={{
                                    width: '100%',
                                    minHeight: '61px',
                                    border: '4px solid #8688A333',
                                    borderRadius: '8px',
                                    px: 2,
                                    py: 3,
                                }}>

                                    <Box sx={{ width: "100%" }} >
                                        <Typography variant='caption' color='#8688A3'>Size</Typography>
                                        <Stack direction='row' alignItems='start' spacing='18px'>
                                            <Stack direction="row" alignItems="start" spacing={1} width={1}>
                                                <TextField variant='filled'
                                                    type='number'
                                                    value={appBar?.text?.size ?? ""}
                                                    // onChange={event => setAppBar({ ...appBar, width: event.target.value })}
                                                    onChange={event => handleChangeEvent('size', event.target.value, 'text')}
                                                />
                                            </Stack>
                                        </Stack>
                                    </Box>

                                    <Box sx={{ width: "100%" }} >
                                        <Typography variant='caption' color='#8688A3'>Is Bold</Typography>
                                        <RadioGroup row value={appBar?.text?.isBold || "true"} onChange={(event: any) => handleChangeEvent('isBold', event?.target?.value, 'text')}>
                                            <FormControlLabel value="true" control={<Radio size="medium" />} label="Show" />
                                            <FormControlLabel value="false" control={<Radio size="medium" />} label="Hide" />
                                        </RadioGroup>
                                    </Box>
                                    <Box sx={{ width: "100%" }} >
                                        <Typography variant='caption' color='#8688A3'>Color</Typography>
                                        <Stack direction='row' alignItems='center' spacing='18px'>
                                            <MuiColorInput sx={{ width: "100%", margin: "auto", }} variant="outlined"
                                                value={appBar?.text?.color ?? "#000001"}
                                                format="hex"
                                                // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, color: event }) : null}
                                                onChange={event => isColorValid(event) ? handleChangeEvent('color', event, 'text') : null}
                                            />
                                        </Stack>
                                    </Box>

                                </Stack>
                            </Box> */}

              <Stack direction="column" gap={2} alignItems="center" justifyContent="space-between">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width={'100%'}
                >
                  <Typography variant="caption" sx={{ fontWeight: 900 }}>
                    Show Search
                  </Typography>
                  <Switch
                    checked={appBar?.search?.status}
                    onChange={(event: any, value: any) => {
                      handleChangeEvent('status', value, 'search');
                      setAppBarSearch((prev) => ({ ...prev, status: !prev.status }));
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
                {appBar?.search?.status && (
                  <Stack width={'100%'}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        Show Input
                      </Typography>
                      <Switch
                        checked={appBar?.search?.input}
                        onChange={(event: any, value: any) => {
                          handleChangeEvent('input', value, 'search');
                          setAppBarSearch((prev) => ({ ...prev, input: !prev.input }));
                        }}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>

                    <Box sx={{ width: '100%', my: 2 }}>
                      <Typography variant="caption" color="#8688A3">
                        Position
                      </Typography>
                      <RadioGroup
                        row
                        value={appBar?.search?.position}
                        onChange={(event: any) => {
                          handleChangeEvent('position', event.target.value, 'search');
                          setAppBarSearch((prev) => ({ ...prev, position: event.target.value }));
                        }}
                      >
                        <FormControlLabel
                          value="left"
                          control={<Radio size="medium" />}
                          label="Left"
                        />
                        <FormControlLabel
                          value="center"
                          control={<Radio size="medium" />}
                          label="Center "
                        />
                        <FormControlLabel
                          value="right"
                          control={<Radio size="medium" />}
                          label="Right"
                        />
                      </RadioGroup>
                    </Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        Add Background & Text Color
                      </Typography>
                      <Switch
                        checked={searchBackgroundColor}
                        onChange={(event: any, value: any) => setSearchBackgroundColor((pv) => !pv)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    {searchBackgroundColor && (
                      <Stack width={'100%'}>
                        {/* <Box sx={{ width: '100%' }}>
                          <Typography variant="caption" color="#8688A3">
                            Background Color
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing="18px"> */}
                        {/* <MuiColorInput
                      sx={{ width: '100%', margin: 'auto' }}
                      variant="outlined"
                      value={appBar?.icon?.backgroundColor ?? '#000001'}
                      format="hex"
                      // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, backgroundColor: event }) : null}
                      onChange={(event) =>
                        isColorValid(event)
                          ? handleChangeEvent('backgroundColor', event, 'icon')
                          : null
                      }
                    /> */}
                        {/* <Sketch
                              onChange={(event: any) =>
                                isColorValid(event?.hex)
                                  ? // ? handleChangeEvent('backgroundColor', event?.hex, 'icon')
                                  handleChangeEvent('textBg', event?.hex, 'search')
                                  : null
                              }
                              presetColors={customPresets}
                              style={{ width: '100%' }}
                            /> */}
                        {/* </Stack> */}
                        {/* </Box> */}

                        <Box sx={{ width: '100%' }}>
                          <Typography variant="caption" color="#8688A3">
                            Text Color
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing="18px">
                            {/* <MuiColorInput
                      sx={{ width: '100%', margin: 'auto' }}
                      variant="outlined"
                      value={appBar?.icon?.tintColor ?? '#000001'}
                      format="hex"
                      // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, tintColor: event }) : null}
                      onChange={(event) =>
                        isColorValid(event) ? handleChangeEvent('tintColor', event, 'icon') : null
                      }
                    /> */}
                            <Sketch
                              onChange={(event: any) => {
                                isColorValid(event?.hex)
                                  ? handleChangeEvent('textColor', event?.hex, 'search')
                                  : null;
                                setAppBarSearch((prev) => ({ ...prev, textColor: event?.hex }));
                              }}
                              presetColors={customPresets}
                              style={{ width: '100%' }}
                            />
                          </Stack>
                        </Box>
                      </Stack>
                    )}

                    {/* <Box sx={{ width: "100%" }} >
                                    <Typography variant='caption' color='#8688A3'>Shadow</Typography>
                                    <RadioGroup row value={appBar?.icon?.shadow || "true"} onChange={(event: any) => handleChangeEvent('shadow', event?.target?.value, 'icon')}>
                                        <FormControlLabel value={"true"} control={<Radio size="medium" />} label="Show" />
                                        <FormControlLabel value={"false"} control={<Radio size="medium" />} label="Hide" />
                                    </RadioGroup>
                                </Box> */}

                    <Box sx={{ width: '100%' }}>
                      <Typography variant="caption" color="#8688A3">
                        Border Width (%)
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing="18px">
                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                          <Slider
                            value={appBar?.search?.borderWidth || 0}
                            onChange={(event: any, newValue: number | number[]) => {
                              handleChangeEvent('borderWidth', newValue, 'search');
                              setAppBarSearch((prev) => ({
                                ...prev,
                                borderWidth: event?.target?.value,
                              }));
                            }}
                            valueLabelDisplay="auto"
                            min={0}
                            max={20}
                          />
                        </Stack>
                      </Stack>
                    </Box>
                    {appBar?.search?.borderWidth > 0 && (
                      <Box sx={{ width: '100%' }}>
                        <Typography variant="caption" color="#8688A3">
                          Border Color
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing="18px">
                          {/* <MuiColorInput
                      sx={{ width: '100%', margin: 'auto' }}
                      variant="outlined"
                      value={appBar?.icon?.borderColor ?? '#000001'}
                      format="hex"
                      // onChange={event => isColorValid(event) ? setAppBar({ ...appBar, borderColor: event }) : null}
                      onChange={(event) =>
                        isColorValid(event) ? handleChangeEvent('borderColor', event, 'icon') : null
                      }
                    /> */}
                          <Sketch
                            onChange={(event: any) => {
                              isColorValid(event?.hex)
                                ? handleChangeEvent('borderColor', event?.hex, 'search')
                                : null;
                              setAppBarSearch((prev) => ({ ...prev, borderColor: event?.hex }));
                            }}
                            presetColors={customPresets}
                            style={{ width: '100%' }}
                          />
                        </Stack>
                      </Box>
                    )}
                  </Stack>
                )}
                {/* <Box sx={{ width: '100%', display: 'flex', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" color="#8688A3">
                      Width
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing="18px">
                      <Stack direction="row" alignItems="center" spacing={1} width={1}>
                        <TextField
                          variant="filled"
                          type="number"
                          value={appBar?.icon?.width}
                          // onChange={event => setAppBar({ ...appBar, width: event.target.value })}
                          onChange={(event) =>
                            handleChangeEvent('width', event.target.value, 'icon')
                          }
                        />
                      </Stack>
                    </Stack>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="#8688A3">
                      Height
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing="18px">
                      <Stack direction="row" alignItems="center" spacing={1} width={1}>
                        <TextField
                          variant="filled"
                          type="number"
                          value={appBar?.icon?.height}
                          // onChange={event => setAppBar({ ...appBar, height: event.target.value })}
                          onChange={(event) =>
                            handleChangeEvent('height', event.target.value, 'icon')
                          }
                        />
                      </Stack>
                    </Stack>
                  </Box>
                </Box> */}
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ width: '100%' }}>
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Cart</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {' '}
            <div>
              {mobile ? (
                <Box pt="20px">
                  <RadioGroup
                    aria-labelledby="cart-buttons-group-label"
                    // defaultValue={themeConfig.cart}
                    onChange={(event) => setCartLogo(event.target.value)}
                    name="cart-buttons-group"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}
                  >
                    {dataCart.map((cart, indx) => (
                      <FormControlLabel
                        key={indx}
                        value={cart.icon}
                        control={<Radio checked={cart.icon === cartLogo} size="medium" />}
                        label={
                          <Stack direction="row" alignItems="center" spacing="20px" ml="15px">
                            <Stack
                              alignItems="center"
                              justifyContent="center"
                              sx={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '12px',
                                backgroundColor: '#8688A3',
                              }}
                            >
                              <Box component="img" src={cart.icon} />
                            </Stack>
                            <Typography variant="button">{cart.name}</Typography>
                          </Stack>
                        }
                      />
                    ))}
                  </RadioGroup>
                </Box>
              ) : (
                <Box pt="20px">
                  <RadioGroup
                    aria-labelledby="cart-buttons-group-label"
                    // defaultValue={themeConfig.cart}
                    onChange={(event) => setCartLogo(event.target.value)}
                    name="cart-buttons-group"
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
                    }}
                  >
                    {dataCart.map((cart, indx) => (
                      <FormControlLabel
                        key={indx}
                        value={cart.icon}
                        control={<Radio checked={cart.icon === cartLogo} size="medium" />}
                        label={
                          <Stack direction="row" alignItems="center" spacing="20px" ml="15px">
                            <Stack
                              alignItems="center"
                              justifyContent="center"
                              sx={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '12px',
                                backgroundColor: '#8688A3',
                              }}
                            >
                              <Box component="img" src={cart.icon} />
                            </Stack>
                            <Typography variant="button">{cart.name}</Typography>
                          </Stack>
                        }
                      />
                    ))}
                  </RadioGroup>
                </Box>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion sx={{ width: '100%' }}>
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Left Header</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {' '}
            <RadioGroup
              aria-labelledby="cart-buttons-group-label"
              // defaultValue={themeConfig.cart}
              onChange={(event) => setHeaderLogo(event.target.value)}
              name="cart-buttons-group"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {dataLeftHeader.map((cart, indx) => (
                <FormControlLabel
                  key={indx}
                  value={cart.icon}
                  control={<Radio checked={cart.icon === headerLogo} size="medium" />}
                  label={
                    <Stack direction="row" alignItems="center" spacing="20px" ml="15px">
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '12px',
                          backgroundColor: '#8688A3',
                        }}
                      >
                        <Iconify style={{ color: 'blue' }} icon={cart.icon} />
                      </Stack>
                      <Typography variant="button">{cart.name}</Typography>
                    </Stack>
                  }
                />
              ))}
            </RadioGroup>
          </AccordionDetails>
        </Accordion>
      </Stack>
    </div>
  );
}
