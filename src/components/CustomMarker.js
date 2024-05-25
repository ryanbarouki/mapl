import React from 'react';
import { Marker } from 'react-map-gl';
import styled from 'styled-components';
import { HiMapPin } from 'react-icons/hi2';

const MarkerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MarkerText = styled.div`
  text-align: center;
  font-size: 20px;
  background-color: white;
  opacity: 0.8;
  border-radius: 3px;
  padding: 5px;
  font-family: BRShape;
`;

const Icon = styled(HiMapPin)`
  font-size: 40px;
  color: black; // Or any color you prefer
`;

const CustomMarker = ({ latitude, longitude, text }) => {
  return (
    <Marker latitude={latitude} longitude={longitude}>
      <MarkerContainer>
        <Icon />
        <MarkerText>{text}</MarkerText>
      </MarkerContainer>
    </Marker>
  );
};

export default CustomMarker;
