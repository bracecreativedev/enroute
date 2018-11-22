import styled from 'styled-components';
export const SidebarContainer = styled.div`
  width: 400px;
  background: #f1f1f1;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100%;
`;

export const LocationList = styled.div`
  height: 100%;
  padding-top: 48px;
`;

export const Header = styled.div`
  background: #6fb32e;
  color: #fff;
  padding: 10px 0;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.18);
  position: absolute;
  top: 0;
  width: 100%;

  h3 {
    font-size: 24px;
    text-transform: uppercase;
    margin-bottom: 0;
    font-weight: 600;
  }
`;

export const ParkingFeed = styled.div`
  padding: 10px;
  height: 100%;
  overflow-y: scroll;

  a {
    text-decoration: none;
  }
`;

export const ParkingCard = styled.div`
  border-radius: 5px;
  background: #fff;
  margin-bottom: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: all 0.3s ease;

  .header {
    background: #5bc6f2;
    color: #fff;
    padding: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);

    h5 {
      margin-bottom: 0;
      font-size: 18px;
    }
  }

  .content {
    padding: 10px;
    text-align: left;
    color: #3c3c3b;
  }

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
  }
`;

export const FeaturedContentContainer = styled.div`
  position: relative;
  z-index: 5;
  height: 100%;

  ${Header} {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: 10px;

    button {
      color: #fff;

      i {
        font-size: 24px;
      }

      &:hover {
        opacity: 0.7;
      }
    }

    h3 {
      text-align: left;
    }
  }

  .content {
    padding: 10px;
    padding-top: 48px;
  }
`;
