(() => {
  let self = {};
  let carouselData = [];
  let currentIndex = 0;
  const itemsToShow = 4;
  const localStorageKey = "carouselProducts";
  const favoritesKey = "carouselFavorites";

  const init = () => {
    // Checks if we're on the homepage
    if (!isHomePage()) {
      console.log("wrong page");
      return;
    }

    // Check if products exist in local storage
    const storedProducts = localStorage.getItem(localStorageKey);

    if (storedProducts) {
      carouselData = JSON.parse(storedProducts);
      buildHTML();
      buildCSS();
      setEvents();
      updateCarousel();
    } else {
      self.fetchProducts();
    }
  };

  const isHomePage = () => {
    // Check if we're on the homepage
    return (
      window.location.pathname === "/" ||
      window.location.pathname === "/index.html" ||
      window.location.pathname === ""
    );
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json"
      );
      const products = await response.json();
      carouselData = products;
      localStorage.setItem(localStorageKey, JSON.stringify(products));
      self.buildHTML();
      self.buildCSS();
      self.setEvents();
      self.updateCarousel();
    } catch (error) {
      console.error("Error fetching products:", error);
      carouselData = [];
    }
  };

  const buildHTML = () => {
    const html = `
    <div class="eb-recommended-carousel banner">
        <div class="eb-container">
            <div class="banner__titles">
                <h2 class="title-primary">Beğenebileceğinizi düşündüklerimiz</h2>
            </div>
            <div class="banner__wrapper">
                <div class="product-carousel">
                    <div class="product-carousel__items"></div>
                </div>
                <button aria-label="back" class="swiper-prev"></button>
                <button aria-label="next" class="swiper-next"></button>
            </div>
        </div>
    </div>
`;
    $(".Section2A").before(html);
  };

  const buildCSS = () => {
    const css = `
            .eb-recommended-carousel.banner {
                padding: 30px 0;
                width: 100%;
                background-color: #fff;
                box-sizing: border-box;
            }
            .eb-recommended-carousel .eb-container {
                max-width: 1280px;
                margin: 0 auto;
                padding: 0 15px;
                box-sizing: border-box;
            }
            .eb-recommended-carousel .banner__titles {
                margin-bottom: 20px;
            }
            .eb-recommended-carousel .title-primary {
                font-size: 28.8px;
                font-weight: 600;
                color: #f28e00;
                margin: 0;
            }
            .eb-recommended-carousel .product-carousel {
                position: relative;
                overflow: hidden;
                padding: 0;
                margin: 0 40px;
                width: calc(100% - 80px);
                box-sizing: border-box;
            }
            .eb-recommended-carousel .product-carousel__items {
                display: flex;
                gap: 20px;
                transition: transform 0.3s ease-in-out;
                width: 100%;
                padding: 0;
                box-sizing: border-box;
                margin: 0 auto;
            }
            .eb-recommended-carousel .product-carousel__items * {
                box-sizing: border-box;
            }
            .eb-recommended-carousel .product-item {
                flex: 0 0 calc((100% - 60px) / 4);
                min-width: calc((100% - 60px) / 4);
                max-width: calc((100% - 60px) / 4);
                margin: 0;
                padding: 4px;
                
            }
            .product-item {
                z-index: 1;
                display: block;
                width: 100%;
                font-family: "Poppins", "cursive";
                font-size: 12px;
                padding: 5px;
                color: #7d7d7d;
                margin: 0 0 20px 3px;
                border: 1px solid #ededed;
                border-radius: 10px; 
                position: relative;
                text-decoration: none;
                background-color: #fff;
            }
            .product-item:hover {
                color:#7d7d7d;
                cursor: pointer;
                z-index: 2;
                position: relative;
                
            }
            .product-item-anchor {
                color: none;
                background: none;
            }
                .product-item-anchor:hover {
                color: none;
                background: none;
            }
            .product-item__img {
               position: relative; ;
               display: block;
               width: 100%;
               background-color: #fff;
            }
            .product-item__img img {
              display: inline-block;
              max-width: 100%;
            max-height: 100%;
            }
        
       

            .product-item-content {
                padding: 15px;
            }
            .product-item__brand {
               
                line-height: 1.4;
               
               
               
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                  font-size: 1.2rem;
                height: 42px;
                overflow: hidden;
                margin-bottom: 10px;
            }
            .product-item__brand b {
                font-weight: 600;
            }
        
            .product-item__price {
                margin-top: 10px;
            }
            .product-item__new-price {
                font-size: 2.2rem;
                font-weight: 600;
                width: 100%;
                color: #7d7d7d;
                display: block;
            }
            .product-item__old-price {
                font-size: 14px;
                color: #999;
                text-decoration: line-through;
                margin-right: 10px;
            }
            .product-item__discount {
                font-size: 18px;
                color: #00a365;
                font-weight: 700;
                display: inline-block;
                jsustify-content: center;
            }
           
            .btn.close-btn {
                background-color: #fff7ec;
                color: #f28e00;
                padding: 15px 20px;
                border-radius: 37.5px;
                width: 100%;
                margin-top: 25px;
                font-familiy: "Poppins", "cursive";
                font-weight: 700;
                font-size: 1.4rem;
            }
            .btn.close-btn:hover {
                background-color: #f28e00;
                color: #fff;
            }
            .btn.close-btn.disable {
                opacity: 1;
            }
            .heart {
                position: absolute;
                top: 10px;
                right: 10px;
                cursor: pointer;
                z-index: 10;
                width: 30px;
                height: 30px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .heart-icon {
                width: 20px;
                height: 20px;
            }
            .heart-icon.empty {
                display: block;
            }
            .heart-icon.filled {
                display: none;
            }
            .heart-icon.hovered {
                display: none;
            }
            .heart:hover .heart-icon.empty {
                display: none;
            }
            .heart:hover .heart-icon.hovered {
                display: block;
            }
            .heart.active .heart-icon.empty,
            .heart.active .heart-icon.hovered {
                display: none;
            }
            .heart.active .heart-icon.filled {
                display: block;
            }
            .swiper-prev, .swiper-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: white;
                border: 1px solid #ddd;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 5;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                transition: all 0.3s;
            }
            .swiper-prev:hover, .swiper-next:hover {
                background: #f5f5f5;
            }
            .swiper-prev {
                left: -40px;
            }
            .swiper-next {
                right: -40px;
            }
           
          
            /* Responsive Styles */
            @media (max-width: 992px) {
                .product-item {
                    flex: 0 0 calc(33.33% - 15px);
                }
            }
            
            @media (max-width: 768px) {
                .product-item {
                    flex: 0 0 calc(50% - 10px);
                }
                .product-carousel {
                    padding: 0 30px;
                }
            }
            
            @media (max-width: 576px) {
                .product-carousel__items {
                    gap: 10px;
                }
                .product-item {
                    flex: 0 0 calc(100% - 10px);
                }
                .product-item__img {
                    height: 180px;
                }
                .title-primary {
                    font-size: 20px;
                }
                .banner {
                    padding: 20px 0;
                }
                
                    
            }
        `;
    $("<style>").addClass("carousel-style").html(css).appendTo("head");
  };

  const getFavorites = () => {
    const favorites = localStorage.getItem(favoritesKey);
    return favorites ? JSON.parse(favorites) : [];
  };

  const addToFavorites = (productId) => {
    const favorites = getFavorites();
    if (!favorites.includes(productId)) {
      favorites.push(productId);
      localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    }
  };

  const removeFromFavorites = (productId) => {
    let favorites = getFavorites();
    favorites = favorites.filter((id) => id !== productId);
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
  };

  const isFavorite = (productId) => {
    const favorites = getFavorites();
    return favorites.includes(productId);
  };

  const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || !currentPrice || originalPrice <= currentPrice)
      return null;

    const discount = originalPrice - currentPrice;
    const discountPercentage = Math.round((discount / originalPrice) * 100);

    return {
      amount: discount.toFixed(2),
      percentage: discountPercentage,
    };
  };

  const renderProductItem = (product, index) => {
    const favorite = isFavorite(product.id);
    const discount = product.original_price
      ? calculateDiscount(product.original_price, product.price)
      : null;

    return `
            <div class="product-item" data-index="${index}" data-product-id="${
      product.id
    }">
                <a href="${
                  product.url
                }" target="_blank" class="product-item-anchor">
                    <figure class="product-item__img">
                
                        <img src="${product.img}" alt="${product.name}">
                   
                    </figure>
                    <div class="product-item-content">
                        <h2 class="product-item__brand">
                            <b>${product.brand} - </b>
                            <span>${product.name}</span>
                        </h2>
                        
                        <div class="product-item__price">
                            ${
                              discount
                                ? `<div class="d-flex align-items-center">
                                    <span class="product-item__old-price">${product.original_price} TL</span>
                                    <span class="product-item__discount">%${discount.percentage}</span>
                                </div>`
                                : ""
                            }
                            <span class="product-item__new-price">${
                              product.price
                            } TL</span>
                        </div>
                    
                    </div>
                </a>
                <div class="heart ${
                  favorite ? "active" : ""
                }" data-product-id="${product.id}">
                    <svg class="heart-icon empty" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <svg class="heart-icon filled" viewBox="0 0 24 24" fill="#ff6b00" stroke="#ff6b00">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </div>
                <div class="product-item-content">
                    <div class="product-item__price">
                        <button type="button" class="btn close-btn add-to-cart-btn">Sepete Ekle</button>
                    </div>
                </div>
            </div>
        `;
  };

  const updateCarousel = () => {
    const $itemsContainer = $(".product-carousel__items");
    $itemsContainer.empty();

    // Önce tüm ürünleri render et
    carouselData.forEach((product, index) => {
      $itemsContainer.append(renderProductItem(product, index));
    });

    // Sonra transform uygula
    const itemWidth = $(".product-item").outerWidth(true);
    const translateX = -currentIndex * (itemWidth + 20);
    $itemsContainer.css("transform", `translateX(${translateX}px)`);
  };

  const nextSlide = () => {
    const maxIndex = carouselData.length - itemsToShow;
    currentIndex = Math.min(currentIndex + 1, maxIndex);
    updateCarousel();
  };

  const prevSlide = () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    updateCarousel();
  };

  const setEvents = () => {
    $(".swiper-next").on("click", () => {
      nextSlide();
    });

    $(".swiper-prev").on("click", () => {
      prevSlide();
    });

    $(document).on("click", ".btn.close-btn", function (e) {
      e.preventDefault();
      const $productItem = $(this).closest(".product-item");
      const index = $productItem.data("index");
      console.log("Added to cart:", carouselData[index].name);
    });

    $(document).on("click", ".heart", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const productId = $(this).data("product-id");

      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        removeFromFavorites(productId);
      } else {
        $(this).addClass("active");
        addToFavorites(productId);
      }
    });

    let resizeTimer;
    $(window).on("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        updateCarousel();
      }, 250);
    });
  };

  self = {
    init,
    fetchProducts,
    buildHTML,
    buildCSS,
    setEvents,
    updateCarousel,
  };

  if (typeof jQuery === "undefined") {
    const script = document.createElement("script");
    script.src =
      "https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js";
    script.onload = init;
    document.head.appendChild(script);
  } else {
    $(document).ready(() => {
      init();
    });
  }
})();
