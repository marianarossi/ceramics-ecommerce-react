import { MDBCarousel, MDBCarouselItem } from 'mdb-react-ui-kit';

export default function App() {
  return (
    <MDBCarousel showIndicators>
      <MDBCarouselItem itemId={1}>
        <img src='/img/ceramiccollection.jpg' className='d-block w-100' alt='Ceramic collection' />
      </MDBCarouselItem>
      <MDBCarouselItem itemId={2}>
        <img src='/img/wheel.jpg' className='d-block w-100' alt='Ceramic Wheel Forming' />
      </MDBCarouselItem>
      <MDBCarouselItem itemId={3}>
        <img src='/img/glaze.jpg' className='d-block w-100' alt='Ceramic pots with glaze' />
      </MDBCarouselItem>
    </MDBCarousel>
  );
}
