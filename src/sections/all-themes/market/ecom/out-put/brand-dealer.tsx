import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import Sketch from '@uiw/react-color-sketch';
import React, { ChangeEvent, useState } from 'react';
import Iconify from 'src/components/iconify';
import BrandAccordion from './brandAccordion';
import { VisuallyHiddenInput } from './logo-part';

interface Props {
  themeConfig: any;
  handleThemeConfig: (key: string, value: any, parentClass: any) => void;
}

const BrandDealer = ({ handleThemeConfig, themeConfig }: Props) => {
  const [brandItems, setBrandItems] = useState([
    {
      name: 'ALDO',
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAhFBMVEUAAAD////S0tK/v793d3d6enqZmZmWlpampqa1tbWIiIi4uLj8/Pzf39/CwsL39/fn5+dRUVGsrKyCgoLY2Njs7OwuLi6Ojo7i4uJLS0uhoaHIyMgfHx9lZWXx8fHV1dVbW1s7OzsUFBQyMjJGRkZjY2MYGBgLCwtubm46OjomJiYdHR1f127mAAADz0lEQVR4nO3YW3uiOhSAYaD1gIqIilas1lo7tc7//39bZIWTCR7Cs5+5+N6bmZoQsnIOjgMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+Pf9OS0Wi/ef/+NV/a4pZdVPTY9NTw+Gfs00Wb7uTk3PfM7G89DNTLzu7smK32vnuqZXdLJKTJseH7ta4dt0ZXhiEIxqmePpl00ENyzOjRka0l6zCvSbnn/RR3jpno4mf68eXmb8aR+KQZCW7+nT7CI8hxJEtdzRxJi711JAdf2s/ESbaNmHqUEl86wp67q9qEqOqviNLvX+CPVDr9523XJCODmLy78ErYaWOYWqats/muQHIvT8oeIP10XFR+4yzzooGmI9OFxW2/3vxg/zrIbJYiMoGnCuSX5glM6qv/4si6J38luUR+1Xd8FOrEL3n47EYFoeI5o4HohwcJVwVH3zJj+8yd/x4SrvUPXi7okoGrxKsfLP9VS0itD5q7oxSxvIawLdMaYr1Wh3Ki7URPnIKhJebbt2ETqOTMfJ5Q/ZJ7Z7bTG+VKa+vViRJl47X6FhKtpG+C3VfnfS9sx6SXcKONtv73jXg2Tsx+dBs5G31ye6bYSqEdNlaCldaConcdseph2J6jIs1JJTa2DrCLOx56ZH+0SNGINjeUS34TAqXu7kjT2qng6tI+wVBUgjGk/xKxlS+mn6BJn3ao9djHRNaB2hhJWea/o3+nDTch9KvcK8xdTOMSznso5QVun0WCPzMDaV0/I8VHtTaW1WU7FcVdsID/Ka3/P/f2Xem67T2xuj+DEy5l3v2CmoI0jpxGEboczubP2MGztRNfDuqYCuxOarQGUmWEaorv/ZarZUzaorZSY9/KZLfNy6Ib6zcZ7RKsLDXMpTpxh1+Q0WV3mT7PA4cr8tQ8ss3Rvy2kqE+uux0N8tnOglP/GqJFktR25Y+/T1HaisL23El355ukV9Q5IIvV5XJ1mVIvRfixm9nK7DorDioNQr7ofDoxyCT1FSfNhoaSEtvdwk/qlEaNIpIjRP7PIGWLmtxcHZJCw93NJuryZht6fxUq3W/REaVY+6vaasc91nhsepTyWGL1tqRvTaiTCsT8/N1pi3pZ1wJxGYDk8n9b6ojQin71cv2Pf1WT9auhieZBIa7zD5x7cwXdI7d0Ro+Obtbr16/4mfblzPG45bu/gm3kVTgyUfWZZ0i/ieew3mm1L+inV/tmtaNaKuly+g4dw//m0rvn/K/usQRavP63EMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAND7D2R2K1f2dL5dAAAAAElFTkSuQmCC',
    },
    {
      name: 'DUNE',
      src: 'data:image/png;base64,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',
    },
    {
      name: 'Nine West',
      src: 'data:image/png;base64,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',
    },
    {
      name: 'UNIQLO',
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UNIQLO_logo.svg/1200px-UNIQLO_logo.svg.png',
    },
    {
      name: 'UNIQLO',
      src: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAABR1BMVEXJTgH////LTQD7///ITgP///3LTQT///b///nMTAHCQgD6///FRwDHRgDITwX///vOmHXatZ3//P///vG9RADjwKm8PwDPRQDp1rPBfVLlzLTZqYfz2sf25M+7ZTS7XCf47uLRlHXEUQC5Tg23QgC5WRzNgFT/+fL5//mzUg399eTkwKDBc0S1RwD89uT//+3HimTasor/9NrAVACqRQDTQAC7SQDJWiLFfVi8gFe9czavXCC9g1THZjK7glvHdlLDf0nOmG3bqXr78tDpz6WyZy///+PCbECrURbw6sevaT3GlHHJpITeybLgtpWuWjfduIm5VCqgSQDANQC8akjjs5y5h1W3f2O+jnLv5eqkNQDr4tfKuqSphEuvTRnTtpamXB3TdTfRj2DPoYbVn3KxVAD63cDWx7ehdFKxbjqcXC/m2KvUlWuVqJbYAAAU7UlEQVR4nO1b61/bOLq2LfmiyJfUdmOSEKCOAUMwgSR124HO9F5aumw73dmdM7tnO6cX9szZ+f8/n/eV48RJaKcQ+mV/emYKwZJlPdar96ooioSEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISEhISExH8WNJcypmmay1xXExciI4a/NRbHhrHQPWKikbLIoPNtVDNiBRqnY+MfODZVphcpNdj8nfBkbXKRRYoh7oQPk+HwYRpjClt87B8hUuKYui514QM+hMaxq7iAGJgv9I7juGiEfu7iYBqDodxyDvhZoMoa6MAY88MyYzgZDkYXd8XVGeCYrmG4w1hZnNWXAasRMeZELtNcXDLDibWIOfBfFMXz78tgrhI52GjY0cKT4EIEbU5Ugo0BBClV6Hj+LJr2GMO+HU0IMkZhFEDEpi8LoeFFaLngzX4RGrtztwnYy4GAIMHyNbzQvNfsLkjEtPHenYXGOKLfNeexd7STJblLEQXD7t69hV53j78rhzPuf/+D6HDcZbjaJSHNfdC827x7n2rzz/0DMPuhaQE6CbxdYDBUnHt9Xfcs1XzkzC8TjenocWCapqWbrUwZujMdYhY+wTbLKn5aludZZrC7evY0YRHsdxyBsaNn2F50GAP+etwALjj5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',
    },
  ]);
  const [numberOfColumns, setNumberOfColumns] = useState(2);
  const [brandSectionStyling, setBrandSectionStyling] = useState({
    header: true,
    title: true,
    viewAll: true,
  });
  const [activeSection, setActiveSection] = useState('Section');
  const [typeItem, setTypeItem] = useState('block');
  const [scrollType, setScrollType] = useState('flex');
  const [brandCardStyling, setBrandCardStyling] = useState({
    boxShadow: 'none',
    borderRadius: '0%',
    borderWidth: '0px',
    border: '',
    backgroundColor: 'transparent',
    image: {
      display: 'block',
      minWidth: '130px',
      height: '',
      margin: '0px',
    },
    content: {
      display: '',
    },
    contentTitle: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 800,
      color: 'black',
    },
    contentSubtitle: {
      display: 'none',
      fontSize: '10px',
      fontWeight: 300,
      color: 'black',
    },
    contentItemsNumber: {
      display: 'none',
      fontSize: '10px',
      fontWeight: 300,
      color: 'black',
    },
  });
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
  return (
    <Stack>
      <Stack padding={'5px'} bgcolor={'white'} width={'100%'}>
        {brandSectionStyling.header && (
          <Stack direction={'row'} justifyContent={'space-between'} sx={{ width: '100%' }}>
            {brandSectionStyling.title && (
              <Typography
                sx={{ width: '100%', display: 'flex', justifyContent: 'start' }}
                color={'black'}
                variant="h6"
              >
                Trending Brands
              </Typography>
            )}
            {brandSectionStyling.viewAll && (
              <Typography
                sx={{
                  textDecoration: 'underline',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'end',
                }}
                color={'grey'}
                variant="h6"
              >
                View All
              </Typography>
            )}
          </Stack>
        )}
        <Box
          sx={{
            display: scrollType,
            overflowX: 'auto',
            gridTemplateColumns: `repeat(${numberOfColumns}, 0fr)`,
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': { display: 'none' },
            gap: '8px',
          }}
        >
          {brandItems.map((item) => (
            <Box
              sx={{
                ...brandCardStyling,
                display: typeItem,
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <img style={{ ...brandCardStyling.image, objectFit: 'cover' }} src={item.src} />
              <Stack
                sx={{
                  ...(brandCardStyling?.content || {}),
                  position: typeItem || 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: typeItem === 'absolute' ? ' translate(-50%, -50%)' : "none",
                }}
              >
                <Typography sx={{ ...brandCardStyling.contentTitle }} variant="caption">
                  {item.name}
                </Typography>
                <Typography sx={{ ...brandCardStyling.contentSubtitle }} variant="caption">
                  Subtitle
                </Typography>
                <Typography sx={{ ...brandCardStyling.contentItemsNumber }} variant="caption">
                  14 items left
                </Typography>
              </Stack>
            </Box>
          ))}
        </Box>
      </Stack>
      <Stack
        sx={{ bgcolor: 'background.neutral', borderRadius: '16px', p: '5px' }}
        direction="row"
        alignItems="center"
        marginTop={3}
        justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
        spacing="20px"
      >
        <Button
          onClick={() => setActiveSection('Section')}
          fullWidth
          variant="contained"
          size="small"
          sx={
            activeSection === 'Section'
              ? {
                borderRadius: '12px',
                color: '#0F1349',
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 6px 20px #00000033',
                '&:hover': { backgroundColor: '#FFFFFF' },
              }
              : {
                borderRadius: '12px',
                color: '#8688A3',
                backgroundColor: 'background.neutral',
                '&:hover': { backgroundColor: 'background.neutral' },
              }
          }
        >
          {' '}
          Section{' '}
        </Button>
        <Button
          onClick={() => setActiveSection('Style')}
          fullWidth
          variant="contained"
          size="small"
          sx={
            activeSection === 'Style'
              ? {
                borderRadius: '12px',
                color: '#0F1349',
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 6px 20px #00000033',
                '&:hover': { backgroundColor: '#FFFFFF' },
              }
              : {
                borderRadius: '12px',
                color: '#8688A3',
                backgroundColor: 'background.neutral',
                '&:hover': { backgroundColor: 'background.neutral' },
              }
          }
        >
          {' '}
          Style{' '}
        </Button>
        <Button
          onClick={() => setActiveSection('Layout')}
          fullWidth
          variant="contained"
          size="small"
          sx={
            activeSection === 'Layout'
              ? {
                borderRadius: '12px',
                color: '#0F1349',
                backgroundColor: '#FFFFFF',
                boxShadow: '0px 6px 20px #00000033',
                '&:hover': { backgroundColor: '#FFFFFF' },
              }
              : {
                borderRadius: '12px',
                color: '#8688A3',
                backgroundColor: 'background.neutral',
                '&:hover': { backgroundColor: '#FFFFFF' },
              }
          }
        >
          {' '}
          Layout{' '}
        </Button>
      </Stack>
      {activeSection === 'Section' && (
        <Stack>
          <Accordion>
            <AccordionSummary
              sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">Section Header</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width={'100%'}
                >
                  <Typography variant="caption" sx={{ fontWeight: 900 }}>
                    With Header
                  </Typography>
                  <Switch
                    checked={brandSectionStyling.header}
                    onChange={() => setBrandSectionStyling((pv) => ({ ...pv, header: !pv.header }))}
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
                    With Title
                  </Typography>
                  <Switch
                    checked={brandSectionStyling.title}
                    onChange={() => setBrandSectionStyling((pv) => ({ ...pv, title: !pv.title }))}
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
                    With View All
                  </Typography>
                  <Switch
                    checked={brandSectionStyling.viewAll}
                    onChange={() =>
                      setBrandSectionStyling((pv) => ({ ...pv, viewAll: !pv.viewAll }))
                    }
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
              </Stack>
            </AccordionDetails>
          </Accordion>
        </Stack>
      )}
      {activeSection === 'Layout' && (
        <Stack>
          <Accordion>
            <AccordionSummary
              sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">Scroll Type</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width={'100%'}
              >
                <Typography variant="caption" sx={{ fontWeight: 900 }}>
                  Vertical Scroll
                </Typography>
                <Switch
                  checked={scrollType === 'grid'}
                  onChange={() => setScrollType((pv) => (pv === 'flex' ? 'grid' : 'flex'))}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">Type Item</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ width: '100%', my: 2 }}>
                <RadioGroup
                  row
                  onChange={(e) => setTypeItem(e.target.value)}
                  value={typeItem}
                // value={logoObj?.position}
                >
                  <FormControlLabel
                    value="flex"
                    control={<Radio size="medium" />}
                    label="Horizontal"
                  />
                  <FormControlLabel
                    value="block"
                    control={<Radio size="medium" />}
                    label="Vertical "
                  />
                  <FormControlLabel
                    value="absolute"
                    control={<Radio size="medium" />}
                    label="Absolute "
                  />
                </RadioGroup>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">Row & Column</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ width: '100%', my: 2 }}>
                <Typography variant="caption" color="#8688A3">
                  No. of Columns
                </Typography>
                <Stack direction="row" alignItems="center" spacing="18px">
                  <Stack direction="row" alignItems="center" spacing={1} width={1}>
                    <Slider
                      value={numberOfColumns}
                      onChange={(_event: Event, newValue: any) => setNumberOfColumns(newValue)}
                      valueLabelDisplay="auto"
                      min={1}
                      max={3}
                    />
                  </Stack>
                </Stack>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Stack>
      )}
      {activeSection === 'Style' && (
        <Stack>
          <Accordion>
            <AccordionSummary
              sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">Shadow</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
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
                  checked={brandCardStyling.boxShadow !== 'none'}
                  onChange={() =>
                    setBrandCardStyling((pv) => ({
                      ...pv,
                      boxShadow:
                        pv.boxShadow === 'none'
                          ? '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
                          : 'none',
                    }))
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Stack>
            </AccordionDetails>
          </Accordion>
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
              <Box sx={{ width: '100%', my: 2 }}>
                <Typography variant="caption" color="#8688A3">
                  Border Radius
                </Typography>
                <Stack direction="row" alignItems="center" spacing="18px">
                  <Stack direction="row" alignItems="center" spacing={1} width={1}>
                    <Slider
                      // value={numberOfColumns}
                      onChange={(_event: any, newValue: any) =>
                        setBrandCardStyling((prev) => ({ ...prev, borderRadius: newValue + '%' }))
                      }
                      valueLabelDisplay="auto"
                      min={0}
                      max={50}
                    />
                  </Stack>
                </Stack>
              </Box>
              <Box sx={{ width: '100%', my: 2 }}>
                <Typography variant="caption" color="#8688A3">
                  Border Width
                </Typography>
                <Stack direction="row" alignItems="center" spacing="18px">
                  <Stack direction="row" alignItems="center" spacing={1} width={1}>
                    <Slider
                      // value={numberOfColumns}
                      onChange={(_event: any, newValue: any) =>
                        setBrandCardStyling((prev: any) => ({ ...prev, borderWidth: newValue }))
                      }
                      valueLabelDisplay="auto"
                      min={0}
                      max={5}
                    />
                  </Stack>
                </Stack>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography variant="caption" color="#8688A3">
                  Border Color
                </Typography>
                <Stack direction="row" alignItems="center" spacing="18px">
                  <Sketch
                    onChange={(event: any) => {
                      setBrandCardStyling((prev) => ({
                        ...prev,
                        border: `${prev?.borderWidth}px solid ${event?.hex} `,
                      }));
                    }}
                    presetColors={customPresets}
                    style={{ width: '100%' }}
                  />
                </Stack>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography variant="caption" color="#8688A3">
                  Background Color
                </Typography>
                <Stack direction="row" alignItems="center" spacing="18px">
                  <Sketch
                    onChange={(event: any) => {
                      setBrandCardStyling((prev) => ({
                        ...prev,
                        backgroundColor: event.hex,
                      }));
                    }}
                    presetColors={customPresets}
                    style={{ width: '100%' }}
                  />
                </Stack>
              </Box>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">Image</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  width={'100%'}
                >
                  <Typography variant="caption" sx={{ fontWeight: 900 }}>
                    With Image
                  </Typography>
                  <Switch
                    checked={brandCardStyling.image.display === 'block'}
                    onChange={() =>
                      setBrandCardStyling((pv) => ({
                        ...pv,
                        image: {
                          ...pv.image,
                          display: pv.image.display === 'block' ? 'none' : 'block',
                        },
                      }))
                    }
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
                <Box sx={{ width: '100%', my: 2 }}>
                  <Typography variant="caption" color="#8688A3">
                    Image Width
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing="18px">
                    <Stack direction="row" alignItems="center" spacing={1} width={1}>
                      <Slider
                        value={Number(brandCardStyling?.image?.minWidth?.split('px')[0]) || 0}
                        onChange={(_event: any, newValue: any) =>
                          setBrandCardStyling((pv) => ({
                            ...pv,
                            image: {
                              ...pv.image,
                              minWidth: newValue + 'px',
                            },
                          }))
                        }
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                      />
                    </Stack>
                  </Stack>
                </Box>
                <Box sx={{ width: '100%', my: 2 }}>
                  <Typography variant="caption" color="#8688A3">
                    Image Height
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing="18px">
                    <Stack direction="row" alignItems="center" spacing={1} width={1}>
                      <Slider
                        value={Number(brandCardStyling?.image?.height?.split('px')[0]) || 0}
                        onChange={(_event: any, newValue: any) =>
                          setBrandCardStyling((pv) => ({
                            ...pv,
                            image: {
                              ...pv.image,
                              height: newValue + 'px',
                            },
                          }))
                        }
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                      />
                    </Stack>
                  </Stack>
                </Box>
                <Box sx={{ width: '100%', my: 2 }}>
                  <Typography variant="caption" color="#8688A3">
                    Margin
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing="18px">
                    <Stack direction="row" alignItems="center" spacing={1} width={1}>
                      <Slider
                        value={Number(brandCardStyling.image.margin.split('px')[0]) || 0}
                        onChange={(_event: any, newValue: any) =>
                          setBrandCardStyling((pv) => ({
                            ...pv,
                            image: {
                              ...pv.image,
                              margin: newValue + 'px',
                            },
                          }))
                        }
                        valueLabelDisplay="auto"
                        min={0}
                        max={15}
                      />
                    </Stack>
                  </Stack>
                </Box>
                <Box sx={{ width: '100%', my: 2 }}>
                  <Typography variant="caption" color="#8688A3">
                    Border Radius
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing="18px">
                    <Stack direction="row" alignItems="center" spacing={1} width={1}>
                      <Slider
                        // value={numberOfColumns}
                        onChange={(_event: any, newValue: any) =>
                          setBrandCardStyling((prev) => ({
                            ...prev,
                            image: {
                              ...prev.image,
                              borderRadius: newValue + '%',
                            },
                          }))
                        }
                        valueLabelDisplay="auto"
                        min={0}
                        max={50}
                      />
                    </Stack>
                  </Stack>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
          <Accordion>
            <AccordionSummary
              sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">Content</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width={'100%'}
              >
                <Typography variant="caption" sx={{ fontWeight: 900 }}>
                  With Content
                </Typography>
                <Switch
                  checked={brandCardStyling.content.display === ''}
                  onChange={() =>
                    setBrandCardStyling((pv) => ({
                      ...pv,
                      content: {
                        ...pv.content,
                        display: pv.content.display === '' ? 'none' : '',
                      },
                    }))
                  }
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Stack>
              <Accordion>
                <AccordionSummary
                  sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
                  expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1">Title</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        Show
                      </Typography>
                      <Switch
                        checked={brandCardStyling.contentTitle.display === 'block'}
                        onChange={() =>
                          setBrandCardStyling((pv) => ({
                            ...pv,
                            contentTitle: {
                              ...pv.contentTitle,
                              display: pv.contentTitle.display === 'block' ? 'none' : 'block',
                            },
                          }))
                        }
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    <Box sx={{ width: '100%', my: 2 }}>
                      <Typography variant="caption" color="#8688A3">
                        Size
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing="18px">
                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                          <Slider
                            value={Number(brandCardStyling.contentTitle.fontSize.split('px')[0]) || 0}
                            onChange={(_event: any, newValue: any) =>
                              setBrandCardStyling((pv) => ({
                                ...pv,
                                contentTitle: {
                                  ...pv.contentTitle,
                                  fontSize: newValue + 'px',
                                },
                              }))
                            }
                            valueLabelDisplay="auto"
                            min={0}
                            max={20}
                          />
                        </Stack>
                      </Stack>
                    </Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        Bold
                      </Typography>
                      <Switch
                        checked={brandCardStyling.contentTitle.fontWeight === 800}
                        onChange={(event: any, newValue: any) =>
                          setBrandCardStyling((pv) => ({
                            ...pv,
                            contentTitle: {
                              ...pv.contentTitle,
                              fontWeight: pv.contentTitle.fontWeight === 800 ? 300 : 800,
                            },
                          }))
                        }
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="caption" color="#8688A3">
                        Color
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing="18px">
                        <Sketch
                          onChange={(event: any) =>
                            setBrandCardStyling((pv) => ({
                              ...pv,
                              contentTitle: {
                                ...pv.contentTitle,
                                color: event?.hex,
                              },
                            }))
                          }
                          presetColors={customPresets}
                          style={{ width: '100%' }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
                  expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1">Sub Title</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        Show
                      </Typography>
                      <Switch
                        checked={brandCardStyling.contentSubtitle.display === 'block'}
                        onChange={() =>
                          setBrandCardStyling((pv) => ({
                            ...pv,
                            contentSubtitle: {
                              ...pv.contentSubtitle,
                              display: pv.contentSubtitle.display === 'block' ? 'none' : 'block',
                            },
                          }))
                        }
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    <Box sx={{ width: '100%', my: 2 }}>
                      <Typography variant="caption" color="#8688A3">
                        Size
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing="18px">
                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                          <Slider
                            value={Number(brandCardStyling.contentSubtitle.fontSize.split('px')[0]) || 0}
                            onChange={(_event: any, newValue: any) =>
                              setBrandCardStyling((pv) => ({
                                ...pv,
                                contentSubtitle: {
                                  ...pv.contentSubtitle,
                                  fontSize: newValue + 'px',
                                },
                              }))
                            }
                            valueLabelDisplay="auto"
                            min={0}
                            max={20}
                          />
                        </Stack>
                      </Stack>
                    </Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        Bold
                      </Typography>
                      <Switch
                        checked={brandCardStyling.contentSubtitle.fontWeight === 800}
                        onChange={(_event: any, newValue: any) =>
                          setBrandCardStyling((pv) => ({
                            ...pv,
                            contentSubtitle: {
                              ...pv.contentSubtitle,
                              fontWeight: pv.contentSubtitle.fontWeight === 800 ? 300 : 800,
                            },
                          }))
                        }
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="caption" color="#8688A3">
                        Color
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing="18px">
                        <Sketch
                          onChange={(event: any) =>
                            setBrandCardStyling((pv) => ({
                              ...pv,
                              contentSubtitle: {
                                ...pv.contentSubtitle,
                                color: event?.hex,
                              },
                            }))
                          }
                          presetColors={customPresets}
                          style={{ width: '100%' }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>
              <Accordion>
                <AccordionSummary
                  sx={{ width: '100%', display: 'flex', alignItems: 'baseline' }}
                  expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                >
                  <Box sx={{ width: '100%' }}>
                    <Typography variant="subtitle1">Items Number</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        Show
                      </Typography>
                      <Switch
                        checked={brandCardStyling.contentItemsNumber.display === 'block'}
                        onChange={() =>
                          setBrandCardStyling((pv) => ({
                            ...pv,
                            contentItemsNumber: {
                              ...pv.contentItemsNumber,
                              display: pv.contentItemsNumber.display === 'block' ? 'none' : 'block',
                            },
                          }))
                        }
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    <Box sx={{ width: '100%', my: 2 }}>
                      <Typography variant="caption" color="#8688A3">
                        Size
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing="18px">
                        <Stack direction="row" alignItems="center" spacing={1} width={1}>
                          <Slider
                            value={Number(brandCardStyling.contentItemsNumber.fontSize.split('px')[0]) || 0}
                            onChange={(_event: Event, newValue: any) =>
                              setBrandCardStyling((pv) => ({
                                ...pv,
                                contentItemsNumber: {
                                  ...pv.contentItemsNumber,
                                  fontSize: newValue + 'px',
                                },
                              }))
                            }
                            valueLabelDisplay="auto"
                            min={0}
                            max={20}
                          />
                        </Stack>
                      </Stack>
                    </Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      width={'100%'}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 900 }}>
                        Bold
                      </Typography>
                      <Switch
                        checked={brandCardStyling.contentItemsNumber.fontWeight === 800}
                        onChange={(_event: any, newValue: any) =>
                          setBrandCardStyling((pv) => ({
                            ...pv,
                            contentItemsNumber: {
                              ...pv.contentItemsNumber,
                              fontWeight: pv.contentItemsNumber.fontWeight === 800 ? 300 : 800,
                            },
                          }))
                        }
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    </Stack>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="caption" color="#8688A3">
                        Color
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing="18px">
                        <Sketch
                          onChange={(event: any) =>
                            setBrandCardStyling((pv) => ({
                              ...pv,
                              contentItemsNumber: {
                                ...pv.contentItemsNumber,
                                color: event?.hex,
                              },
                            }))
                          }
                          presetColors={customPresets}
                          style={{ width: '100%' }}
                        />
                      </Stack>
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </AccordionDetails>
          </Accordion>
        </Stack>
      )}
    </Stack>
  );
};

export default BrandDealer;
