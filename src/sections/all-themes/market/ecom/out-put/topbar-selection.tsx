import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Sketch from '@uiw/react-color-sketch';
import React, { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Iconify from 'src/components/iconify';
import { VisuallyHiddenInput } from './logo-part';
import { AppDispatch } from 'src/redux/store/store';
import { useDispatch } from 'react-redux';
import { socketClient } from 'src/sections/all-themes/utils/helper-functions';
import OfferNavbar from 'src/sections/all-themes/component/OfferNavbar';
import { sections } from 'src/sections/all-themes/component/response';
import Slider from 'react-slick';
import HeaderSection from './header-section';
import { LoadingScreen } from 'src/components/loading-screen';
import { createAdAppbarSlider, updateAdAppbarSlider, updateBasicAdAppbar } from 'src/redux/store/thunks/builder';
interface TopBarProps {
  themeConfig: {
    navLogoPosition: string;
  };
  handleThemeConfig: (key: string, value: any) => void; // Adjust 'value' type as needed
  mobile?: boolean;
  builder_Id: any;
  url?: any;
  ref?: any
}

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

const TopBarDealer = ({
  themeConfig,
  handleThemeConfig,
  mobile = false,
  builder_Id,
  url
}: TopBarProps) => {

  const dispatch = useDispatch<AppDispatch>();
  const socket = socketClient();

  const targetHeader = 'home.sections.appBar.adAppBar.';

  const [topBarObj, setTopBarObj] = useState<any>({});
  const [loader, setLoader] = useState<any>(false);

  const [appBarItems, setAppBarItems] = useState([]);
  const [sliderArray, setSliderArray] = useState([]);

  // Create a ref to store the latest state value
  const appBarItemsRef = useRef(appBarItems);
  appBarItemsRef.current = appBarItems;

  let timeoutId: any;
  const debounce = (func: any, delay: any) => {
    return (...args: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };




  // useEffect(() => {
  //   console.log("topBarObj", topBarObj);
  // }, [topBarObj])

  // useEffect(() => {
  //   handleAppBarItemsChange()
  // }, [appBarItems])

  const handleChangeEvent = debounce((key: any, newValue: any, parentClass: any = null) => {

    // console.log(key, newValue, parentClass);


    let _socketKey = '';
    let valueToShare = '';
    const nestedAppbar = parentClass ? topBarObj?.[parentClass] : null;

    // console.log("topBarObj", topBarObj);
    // console.log("nestedAppbar", nestedAppbar);
    // console.log("nestedAppbar", typeof nestedAppbar);

    if (nestedAppbar !== null) {
      setTopBarObj({ ...topBarObj, [parentClass]: { ...nestedAppbar, [key]: newValue } });
    } else {
      // const newObject = { ...topBarObj, [key]: newValue };
      // console.log("newObject", newObject);

      setTopBarObj({ ...topBarObj, [key]: newValue });
    }



    _socketKey = parentClass ? parentClass + '.' + key : key;
    // valueToShare = typeof newValue === 'number' ? `${newValue}px` : newValue;
    valueToShare = newValue;

    // const targetHeader = 'appBar.websiteLogo.';
    const data = {
      builderId: builder_Id,
      key: targetHeader + _socketKey,
      value: valueToShare,
    };

    console.log("data", data);
    if (socket) {
      socket.emit('website:cmd', data);
    }
  }, 1500);


  const isColorValid = (color: string) =>
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(\d{1,3}, \d{1,3}, \d{1,3}\)$|^rgba\(\d{1,3}, \d{1,3}, \d{1,3}, (0(\.\d{1,2})?|1(\.0{1,2})?)\)$|^hsl\(\d{1,3}, \d{1,3}%, \d{1,3}%\)$|^hsla\(\d{1,3}, \d{1,3}%, \d{1,3}%, (0(\.\d{1,2})?|1(\.0{1,2})?)\)$/.test(
      color
    );

  const handleAppBarItemsChange = () => {
    const currentAppBarItems = appBarItemsRef.current;
    let _socketKey = 'slider';
    const data = {
      builderId: builder_Id,
      key: targetHeader + _socketKey,
      value: currentAppBarItems,
    };
    if (socket) {
      console.log("data.", data);

      // socket.emit('website:cmd', data);
    }
  };

  const debouncedHandleAppBarItemsChange = React.useCallback(
    debounce(handleAppBarItemsChange, 2000),
    []
  );

  useEffect(() => {
    debouncedHandleAppBarItemsChange();
  }, [appBarItems]);

  const handleSliderItemChange = (index: number, value: any, target: string) => {
    setAppBarItems((prev: any) => {
      return prev.map((item: any, i: number) => {
        if (i === index) {
          return {
            ...item,
            [target]: value,
          };
        } else {
          return item;
        }
      });
    });
  };

  const handleImageChange64 = (key: number) => (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1]; // Get the base64 data
        // console.log('Base64:', base64); // Log the base64 data
        handleSliderItemChange(key, reader.result?.toString() || '', 'image');
        handleSliderItemChange(key, file, 'adAppbarFile');
      };

      reader.readAsDataURL(file); // Read the file as data URL
    } else {
      alert('Please select a valid image file.');
    }
  };
  const [adAppbar, setAdAppbar] = useState(sections[0].appBar.adAppBar);

  const handleTextChange = (index: any, event: any, name: any) => {
    const value = name !== 'color' ? event.target.value : event;
    setAdAppbar((prevState: any) => ({
      ...prevState,
      Slider: prevState.Slider.map((item: any, i: any) => {
        if (i === index) {
          return {
            ...item,
            [name]: value,
          };
        }
        return item;
      }),
    }));
  };


  const childFunction = () => {
    setLoader(true);
    const payloadData = {
      status: adAppbar.status,
      width: adAppbar.width,
      height: adAppbar.height,
      bakgroundColor: adAppbar.backgroundColor,
      AdText: "ad text",
      href: "/ref",
      textPosition: adAppbar.textPosition
    };
    setTimeout(() => {
      dispatch(updateBasicAdAppbar({ builderId: builder_Id, url: url, data: payloadData })).then((response: any) => {
        console.log("response", response);
        setLoader(false)
      })
    }, 1000);

  };

  const handleSaveItem = (item: any) => {
    console.log(item);
    setLoader(true);
    const payloadData = {
      adAppbarFile: item?.adAppbarFile,
      data: JSON.stringify({
        text: item?.text || "",
        href: item?.href || ""
      })
    };
    setTimeout(() => {
      dispatch(createAdAppbarSlider({ builderId: builder_Id, url: url, data: payloadData })).then((response: any) => {
        console.log("response", response);
        setLoader(false)
      })
    }, 1000);
  }


  // add new row call API
  const handleAddRow = () => {

    setAppBarItems((pv: any) =>
      pv?.length < 3 ? [...pv, { text: '', image: '', href: '' }] : pv
    );
    setAdAppbar((prevState: any) => ({
      ...prevState,
      Slider: [...prevState.Slider, { text: '', image: '', href: '' }],
    }));
  }


  return (
    <>
      {loader && (
        <LoadingScreen />
      )}
      <HeaderSection
        name={"Top Bar"}
        cancel={{ key: 'cart', value: '/raw/cart1.svg' }}
        handleCancelBtn={() => { }}
        handleThemeConfig={() => { }}
        closer={() => childFunction()}
      />
      <Stack gap={2} direction={'column'}>
        {/* <Box sx={{ border: '4px solid lightgray' }}>
        <img src="https://s3.ezgif.com/tmp/ezgif-3-392363cace.gif" />
      </Box> */}
        <OfferNavbar adAppbar={adAppbar} />
        <Accordion>
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Container</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              gap={2}
              width={'100%'}
            >
              <Typography variant="caption" sx={{ fontWeight: 900 }}>
                Show Topbar
              </Typography>
              <Switch
                inputProps={{ 'aria-label': 'controlled' }}
                checked={topBarObj?.status}
                onChange={(event: any, value: any) => handleChangeEvent('status', value)}
              />
            </Stack>
            <Box sx={{ width: '100%', display: 'flex', gap: 2, my: 2 }}>
              <Box>
                <Typography variant="caption" color="#8688A3">
                  Width
                </Typography>
                <Stack direction="row" alignItems="center" spacing="18px">
                  <Stack direction="row" alignItems="center" spacing={1} width={1}>
                    <TextField
                      variant="filled"
                      type="number"
                      value={topBarObj?.width}
                      onChange={(event) => handleChangeEvent('width', event.target.value)}
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
                      value={topBarObj?.height}
                      onChange={(event) => handleChangeEvent('height', event.target.value)}
                    />
                  </Stack>
                </Stack>
              </Box>
            </Box>
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
                    isColorValid(event?.hex) ? handleChangeEvent('bakgroundColor', event?.hex) : null;

                    setAdAppbar((prev) => ({ ...prev, backgroundColor: event?.hex }));
                  }}
                  presetColors={customPresets}
                  style={{ width: '100%' }}
                />
              </Stack>
            </Box>
            <Divider />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
            expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="subtitle1">Ad Offer</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" >Add Appbar Text</Typography>
              <IconButton
                onClick={() => handleAddRow()}
                color="primary"
              >
                <Iconify icon="ic:baseline-plus" />
              </IconButton>
            </Box>
            <Stack gap={3}>
              {appBarItems.map((item, i) => (
                <Box key={i} sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} mt={2} >
                    <Typography variant="caption" sx={{ fontWeight: 900 }}>
                      Ad {i + 1}
                    </Typography>
                    <Button variant='contained' sx={{ backgroundColor: '#F5F5F8', color: '#898BA5', '&:hover': { backgroundColor: '#DEE1E6' } }} onClick={() => { handleSaveItem(item) }} >
                      Save
                    </Button>

                  </Stack>
                  <Stack direction="row" my={2} alignItems="center" spacing="20px">
                    <Box
                      sx={{
                        width: '80px',
                        height: '80px',
                        outline: '#EBEBF0 dashed 4px',
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundSize: '100% 100%',
                      }}
                      component="label"
                    >
                      <VisuallyHiddenInput type="file" onChange={handleImageChange64(i)} />
                      <Iconify icon="bi:image" style={{ color: '#C2C3D1', display: 'block' }} />
                    </Box>

                    <Box>
                      <Typography
                        component="p"
                        sx={{ fontSize: '13px !important' }}
                        variant="caption"
                        color="#8688A3"
                      >
                        Maximum size is 5mb
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ fontSize: '11px !important' }}
                        color="#8688A3"
                      >
                        You can use these extensions <br /> SVG, PNG or JPG
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack gap={1}>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Typography variant="caption" color="#8688A3">
                        Text
                      </Typography>

                      <TextField
                        variant="filled"
                        type="text"
                        placeholder="Get 25% Off"
                        value={topBarObj?.Slider?.[`text${i}`]}
                        onChange={(event) => {
                          handleSliderItemChange(i, event.target.value, 'text')
                          // handleChangeEvent(`text${i}`, event.target.value, 'Slider');
                          handleTextChange(i, event, 'text');
                        }}
                      />
                    </Box>
                    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <Typography variant="caption" color="#8688A3">
                        Link (optional)
                      </Typography>

                      <TextField
                        variant="filled"
                        type="text"
                        placeholder="www.overzaki.com"
                        // value={appBar?.logoObj?.width}
                        onChange={(event) => {
                          handleTextChange(i, event, 'href')
                          handleSliderItemChange(i, event.target.value, 'href')
                        }}

                      />
                    </Box>
                  </Stack>
                  <Box sx={{ width: '100%', my: 2 }}>
                    <Typography variant="caption" color="#8688A3">
                      Offer Text Color
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing="18px">
                      {/* <MuiColorInput
            sx={{ width: '100%', margin: 'auto' }}
            variant="outlined"
            value={logoObj?.color ?? '#000001'}
            format="hex"
            onChange={(event) =>
              isColorValid(event) ? handleChangeEvent('color', event, 'logoObj') : null
            }
          /> */}
                      <Sketch
                        onChange={(event) => handleTextChange(i, event.hex, 'color')}
                        presetColors={customPresets}
                        style={{ width: '100%' }}
                      />
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Stack>
            <Box sx={{ width: '100%', my: 2 }}>
              <Typography variant="caption" color="#8688A3">
                Offer Text Position
              </Typography>

              <RadioGroup
                onChange={(event: any) => {
                  setAdAppbar((prev) => ({ ...prev, textPosition: event.target.value }));
                  handleChangeEvent(`textPosition`, event.target.value)
                }}
                row
              >
                <FormControlLabel value="left" control={<Radio size="medium" />} label="Left" />
                <FormControlLabel value="center" control={<Radio size="medium" />} label="Center " />
                <FormControlLabel value="right" control={<Radio size="medium" />} label="Right" />
              </RadioGroup>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Stack >
    </>
  );
};

export default TopBarDealer;
function setLoader(arg0: boolean) {
  throw new Error('Function not implemented.');
}

