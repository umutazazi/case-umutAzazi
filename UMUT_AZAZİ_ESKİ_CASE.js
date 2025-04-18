(() => {
  let self = {};
  let products = [];
  let favoriteProducts = [];
  let currentPosition = 0;

  const getFavoriteProducts = () => {
    try {
      favoriteProducts = JSON.parse(
        localStorage.getItem("favoriteProducts") || "[]"
      );
    } catch (error) {
      console.error("Error parsing favoriteProducts:", error);
      favoriteProducts = [];
    }
  };

  const init = async () => {
    self = {
      getFavoriteProducts,
      buildHTML,
      buildCSS,
      setEvents,
      getProducts,
      toggleFavorite,
      handleSlide,
      updateCarouselPosition,
    };

    // Get favorites before products to ensure they're available when building HTML
    self.getFavoriteProducts();
    await self.getProducts();
    self.buildHTML();
    self.buildCSS();
    self.setEvents();
  };

  const getProducts = async () => {
    // Try to get products from localStorage first
    const storedProducts = localStorage.getItem("carouselProducts");
    if (storedProducts) {
      try {
        products = JSON.parse(storedProducts);
        return;
      } catch (error) {
        console.error("Error parsing stored products:", error);
      }
    }

    // If not in localStorage or parsing failed, fetch from API
    try {
      const response = await fetch(
        "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json"
      );
      products = await response.json();
      localStorage.setItem("carouselProducts", JSON.stringify(products));
    } catch (error) {
      console.error("Error fetching products:", error);
      products = [];
    }
  };

  const toggleFavorite = (heartIcon) => {
    const productId = heartIcon.dataset.productId.toString();

    // Get latest favorites from localStorage before modifying
    getFavoriteProducts();

    if (favoriteProducts.includes(productId)) {
      const index = favoriteProducts.indexOf(productId);
      favoriteProducts.splice(index, 1);
      heartIcon.classList.remove("filled");
      heartIcon.querySelector("path").setAttribute("fill", "none");
      heartIcon.querySelector("path").setAttribute("stroke", "black");
    } else {
      favoriteProducts.push(productId);
      heartIcon.classList.add("filled");
      heartIcon.querySelector("path").setAttribute("fill", "#193db0");
      heartIcon.querySelector("path").setAttribute("stroke", "#193db0");
    }

    localStorage.setItem("favoriteProducts", JSON.stringify(favoriteProducts));
  };

  //Build html here
  const buildHTML = () => {
    const html = `<div class="product-recommendations">
      <div class="product-recommendations-carousel">
        <div class="product-carousel-container">
          <p class="product-carousel-title">You Might Also Like</p>
          <button class="carousel-arrow prev"><svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg></button>
          <button class="carousel-arrow next rotate-180"><svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg></button>
          <div class="carousel padded-carousel-case">
            <div class="product-carousel">
              ${products
                .map((product) => {
                  const isFavorite = favoriteProducts.includes(
                    product.id.toString()
                  );
                  return `
                    <div class="product-card">
                      <a href="${product.url}" target="_blank">
                        <img src="${product.img}" alt="${product.name}">
                      </a>
                      <svg class="heart-icon ${isFavorite ? "filled" : ""}" 
                           data-product-id="${product.id}" 
                           viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                              fill="${isFavorite ? "#193db0" : "none"}"
                              stroke="${isFavorite ? "#193db0" : "black"}"
                        />
                      </svg>
                      <div class="product-info">
                        <div class="product-title">${product.name}</div>
                        <div class="product-price">${
                          product.price + " TRY"
                        }</div>
                      </div>
                    </div>
                  `;
                })
                .join("")}
            </div>
          </div>
        </div>
      </div>
    </div>`;

    $(".product-detail").after(html);
  };

  //Building css for styling
  const buildCSS = () => {
    const css = `
  .product-recommendations {
    background-color: #faf9f7;
    position: relative;
    box-sizing: border-box;
    display: block;
    unicode-bidi: isolate;
    
}
.product-recommendations-carousel{
   margin-left: 15px;
   box-sizing: border-box;
    
}

.carousel{
position: relative;
}
.padded-carousel-case{
    padding-bottom: 24px;
    overflow: hidden;
}
*{
    box-sizing: border-box;
}

.product-carousel-container {
    background-color: #faf9f7;
    position: relative;
}
.product-carousel-title {
    font-size: 24px;
    color: #29323b;
    line-height: 33px;
    font-weight: lighter;
    padding: 15px 0;
    margin: 0;
}
.product-carousel {
    position: relative;
    display: flex;
    transition: transform 0.3s ease-in-out;
    gap: 20px;
    box-sizing: border-box;
}
.product-card {
    flex: 0 0 calc(100% / 7);
    position: relative;
    height: 38rem;
    width: 21rem;
    background-color: #fff
}
.product-card img {
    width: 100%;
    height: auto;
    display: block;
}
.product-card .heart-icon {
    position: absolute;
    top: 9px;
    right: 15px;
    width: 34px;
    height: 34px;
    cursor: pointer;
    background: white;
    padding: 5px;
    border-radius: 5px;
    border: solid .5px #b6b7b9;
    box-shadow: 0 3px 6px 0 rgba(0,0,0,.16);
}
.product-card .heart-icon.filled {
    fill: #193db0;
    stroke: #193db0;
}
.product-info {
display: flex;
flex-direction: column;
    padding: 0 10px;
}
.product-title {
    margin-top:5px;
    font-size: 14px;
    margin-bottom: 5px;
}
.product-price {
    color: #193db0;
  font-size: 18px;
  display: inline-block;
  line-height: 22px;
  font-weight: bold;
}
.carousel-arrow {
    position: absolute;
    top: 50%;
    background: none;
    border: none;
    cursor: default;
    
}
.carousel-arrow.prev {
    left: -35px;
}
.carousel-arrow.next {
    right: -35px;
}
.rotate-180 {
  transform: rotate(180deg);
}
@media (min-width: 992px) {
    .product-recommendations-carousel{
    display: flex;
    justify-content: center;
    }
    .product-recommendations-carousel .product-carousel-title{
        font-size: 32px;
        line-height: 43px;
    }
 
}
@media (min-width: 992px) {
    .product-carousel-container{
    display: block;
    width: 80%;
    }
}
@media (max-width: 1200px) {
    .product-card {
        flex: 0 0 calc(100% / 4.5);
    }
}
@media (max-width: 768px) {
    .product-card {
        flex: 0 0 calc(100% / 2.5);
    }
}
@media (max-width: 480px) {
    .product-card {
        flex: 0 0 calc(100% / 1.5);
    }
}`;
    //Adds <style> to html
    $("<style>").addClass("carousel-style").html(css).appendTo("head");
  };

  //Carousel functionality
  const handleSlide = (direction) => {
    const carousel = $(".product-carousel")[0];
    const cardWidth = $(".product-card")[0].offsetWidth;
    const slideAmount = cardWidth + 20; // 20px is the gap between cards, gets one product each slide
    const maxScroll = -(carousel.scrollWidth - carousel.offsetWidth);

    if (direction === "prev") {
      currentPosition = Math.min(currentPosition + slideAmount, 0);
    } else {
      currentPosition = Math.max(currentPosition - slideAmount, maxScroll);
    }

    self.updateCarouselPosition();
  };

  const updateCarouselPosition = () => {
    $(".product-carousel").css("transform", `translateX(${currentPosition}px)`);
  };

  const setEvents = () => {
    // Heart icon click events
    $(".heart-icon").on("click", function (e) {
      e.preventDefault();
      self.toggleFavorite(this);
    });

    // Navigation arrow events
    $(".carousel-arrow.prev").on("click", () => self.handleSlide("prev"));
    $(".carousel-arrow.next").on("click", () => self.handleSlide("next"));

    // Handle resize
    $(window).on("resize", () => {
      currentPosition = 0;
      self.updateCarouselPosition();
    });
  };

  // Check if jQuery is loaded if else load it
  if (typeof jQuery === "undefined") {
    const script = document.createElement("script");
    script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
    script.onload = init;
    document.head.appendChild(script);
  } else {
    init();
  }
})();
