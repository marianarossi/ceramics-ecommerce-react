import CarouselComponent from "@/components/carousel";
import FooterComponent from "@/components/footer";
import NavBar from "@/components/navbar";
import ProductSlide from "@/components/product-slide";


const HomePage = () => {
    return (
      <div>
        <NavBar />
        
        <main>
          {/* Carousel */}
          <CarouselComponent />
  
          {/* Section: About the website */}
          <section className="mt-5 container" id="aboutus">
            <div className="row">
              <div className="col-md-6 gx-5 mb-4">
                <div className="bg-image hover-overlay shadow-2-strong" data-mdb-ripple-init data-mdb-ripple-color="light">
                  <img src="/img/ceramictools.jpg" className="img-fluid" alt="Ceramic Tools" />
                  <a href="#!">
                    <div className="mask" style={{ backgroundColor: 'rgba(251, 251, 251, 0.15)' }}></div>
                  </a>
                </div>
              </div>
  
              <div className="col-md-6 gx-5 mb-4">
                <h4><strong>Discover Unique Handcrafted Ceramics</strong></h4>
                <p className="text-muted">
                  Your online destination for unique, handcrafted ceramic art.
                  Our collection includes beautiful vases, bowls, mugs, and plates.
                  Each piece blends traditional techniques with modern design,
                  perfect for enhancing your home or gifting.
                </p>
                <p><strong>Support Sustainability and Fair Trade</strong></p>
                <p className="text-muted">
                  Enjoy a seamless shopping experience with detailed product descriptions,
                  high-resolution images, and secure checkout.
                  Explore our curated selection to find the perfect ceramic piece to elevate your space.
                </p>
              </div>
            </div>
          </section>
  
          {/* Product Cards */}
          <ProductSlide/>
          
        </main>
  
        <FooterComponent />
      </div>
    );
  };
  
  export default HomePage;

// export function HomePage() {
//     return (
//         <>
//             <NavBar />
//             <main></main> 
//             {/* <h1 className="h3 mb-3 fw-normal">HOME PAGE</h1> */}
//             <CarouselComponent/>
//             <FooterComponent />
//         </>
//     );
// }