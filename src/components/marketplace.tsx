"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { conditionLabels, formatPrice } from "@/lib/format";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number | null;
  imageUrl: string;
  condition: keyof typeof conditionLabels;
  location: string;
  isFeatured: boolean;
  category: string;
  seller: string;
};

type Category = { name: string; slug: string; icon: string };
type Props = {
  products: Product[];
  categories: Category[];
  productCount: number;
  sellerCount: number;
};

export default function Marketplace({
  products,
  categories,
  productCount,
  sellerCount,
}: Props) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [listingOpen, setListingOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("vi");
    const filtered = products.filter((product) => {
      const matchesCategory = activeCategory === "Tất cả" || product.category === activeCategory;
      const matchesSearch =
        !query ||
        `${product.name} ${product.category} ${product.location} ${product.seller}`
          .toLocaleLowerCase("vi")
          .includes(query);
      return matchesCategory && matchesSearch;
    });
    if (sort === "low") return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === "high") return [...filtered].sort((a, b) => b.price - a.price);
    return filtered;
  }, [activeCategory, products, search, sort]);

  const cartProducts = cart
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
  const cartTotal = cartProducts.reduce((sum, product) => sum + product.price, 0);
  const featured = products.find((product) => product.isFeatured) ?? products[0];

  function addToCart(product: Product) {
    setCart((current) => (current.includes(product.id) ? current : [...current, product.id]));
    setSelectedProduct(null);
    setNotice("Đã thêm món đồ vào giỏ.");
    window.setTimeout(() => setNotice(""), 2600);
  }

  function removeFromCart(productId: string) {
    setCart((current) => current.filter((id) => id !== productId));
  }

  async function submitListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          description: form.get("description"),
          price: form.get("price"),
          condition: form.get("condition"),
          categorySlug: form.get("categorySlug"),
          location: form.get("location"),
          sellerName: form.get("sellerName"),
          imageUrl: form.get("imageUrl"),
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        setNotice(result.error ?? "Chưa đăng được món đồ. Vui lòng thử lại.");
        return;
      }
      setListingOpen(false);
      setNotice("Món đồ đã lên chợ. Cảm ơn bạn đã cho đồ một vòng đời mới!");
      router.refresh();
    } catch {
      setNotice("Không thể kết nối để đăng món đồ. Kiểm tra mạng rồi thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNotice("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerName: form.get("buyerName"),
          buyerEmail: form.get("buyerEmail"),
          productIds: cart,
        }),
      });
      const result = (await response.json()) as { error?: string; orderId?: string };
      if (!response.ok) {
        setNotice(result.error ?? "Chưa tạo được đơn hàng. Vui lòng thử lại.");
        return;
      }
      setCart([]);
      setCheckoutOpen(false);
      setCartOpen(false);
      setNotice(`Đã giữ món cho bạn · Mã đơn ${result.orderId?.slice(-7).toUpperCase()}`);
      router.refresh();
    } catch {
      setNotice("Không thể kết nối để giữ món. Kiểm tra mạng rồi thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <div className="announcement">
        <span>Đồ tốt còn vòng đời</span>
        <span className="announcement-divider" aria-hidden="true" />
        <span>Mỗi món đồ cũ, một khởi đầu mới</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#" aria-label="Lại Dùng, về đầu trang">
          <span className="brand-mark" aria-hidden="true">l.</span>
          <span className="brand-name">lại dùng<span>®</span></span>
        </a>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <a href="#cho-do">Đi chợ</a>
          <a href="#cach-hoat-dong">Cách hoạt động</a>
        </nav>
        <div className="header-actions">
          <button className="sell-link" onClick={() => setListingOpen(true)}>Đăng món đồ</button>
          <button className="cart-button" onClick={() => setCartOpen(true)} aria-label={`Mở giỏ hàng, ${cart.length} món`}>
            <CartIcon />
            <span>Giỏ đồ</span>
            <span className="cart-count">{cart.length}</span>
          </button>
        </div>
      </header>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-kicker"><span className="live-dot" /> Chợ đồ cũ tuyển chọn</p>
          <h1 id="hero-title">Đồ tốt.<br />Giá <span>nhẹ.</span><br />Về nhà mới.</h1>
          <p className="hero-description">
            Món đồ còn đẹp xứng đáng được dùng tiếp. Tìm một thứ bạn cần, hoặc gửi món của bạn đi tiếp.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#cho-do">Tìm món hay <span aria-hidden="true">↘</span></a>
            <button className="button button-outline" onClick={() => setListingOpen(true)}>Đăng bán miễn phí</button>
          </div>
          <div className="hero-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>MA</span><span>HN</span><span>HM</span><span>+</span>
            </div>
            <p><strong>{sellerCount.toLocaleString("vi-VN")} người bán</strong><br />đang tìm chủ mới cho đồ tốt</p>
          </div>
        </div>
        <div className="hero-art">
          {featured && (
            <button
              className="hero-photo"
              onClick={() => setSelectedProduct(featured)}
              aria-label={`Xem ${featured.name}`}
            >
              <Image src={featured.imageUrl} alt={featured.name} fill priority sizes="(max-width: 700px) 90vw, 48vw" />
              <span className="photo-note">MÓN ĐỒ TUẦN NÀY</span>
              <span className="hero-product-label">
                <span>{featured.name}</span><strong>{formatPrice(featured.price)}</strong>
              </span>
            </button>
          )}
          <div className="hero-sticker"><span>đã dùng</span><strong>vẫn mê</strong><i aria-hidden="true">✳</i></div>
          <div className="hero-caption">đồ có câu chuyện<br />đang chờ chương mới</div>
          <span className="hero-sparkle" aria-hidden="true">✳</span>
        </div>
      </section>

      <section className="ticker" aria-label="Lợi ích khi mua đồ đã qua sử dụng">
        <div className="ticker-track">
          <span>Mua vừa túi</span><i>✳</i><span>Dùng thêm lâu</span><i>✳</i>
          <span>Đồ thật · ảnh thật</span><i>✳</i><span>Gặp nhau gần nhà</span><i>✳</i>
          <span>Mua vừa túi</span><i>✳</i><span>Dùng thêm lâu</span><i>✳</i>
          <span>Đồ thật · ảnh thật</span><i>✳</i><span>Gặp nhau gần nhà</span><i>✳</i>
        </div>
      </section>

      <section className="market-section" id="cho-do">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Có gì hay hôm nay?</p>
            <h2>Món tốt, giá <span>thật.</span></h2>
          </div>
          <p className="section-aside">{productCount} món đồ đang tìm chủ<br />Mỗi món chỉ có một thôi nhé.</p>
        </div>
        <div className="shop-controls">
          <div className="category-list" aria-label="Lọc theo danh mục">
            {["Tất cả", ...categories.map((category) => category.name)].map((category) => (
              <button
                key={category}
                className={`category-chip ${activeCategory === category ? "active" : ""}`}
                onClick={() => setActiveCategory(category)}
                aria-pressed={activeCategory === category}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="shop-tools">
            <label className="search-box">
              <SearchIcon />
              <input
                aria-label="Tìm món đồ"
                placeholder="Tìm món bạn cần..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              {search && <button onClick={() => setSearch("")} aria-label="Xóa nội dung tìm kiếm">×</button>}
            </label>
            <label className="sort-control">
              <span>Sắp xếp</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sắp xếp sản phẩm">
                <option value="newest">Mới nhất</option>
                <option value="low">Giá thấp trước</option>
                <option value="high">Giá cao trước</option>
              </select>
            </label>
          </div>
        </div>
        {visibleProducts.length ? (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <button className="product-image" onClick={() => setSelectedProduct(product)} aria-label={`Xem ${product.name}`}>
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(max-width: 600px) 46vw, (max-width: 1000px) 30vw, 23vw"
                  />
                  {product.isFeatured && <span className="product-tag">Món được thích</span>}
                  <span className="condition-tag">{conditionLabels[product.condition]}</span>
                </button>
                <div className="product-info">
                  <div className="product-category">{product.category}<span>{product.location.split(",")[0]}</span></div>
                  <button className="product-name" onClick={() => setSelectedProduct(product)}>{product.name}</button>
                  <div className="product-price-row">
                    <strong>{formatPrice(product.price)}</strong>
                    {product.originalPrice && <del>{formatPrice(product.originalPrice)}</del>}
                  </div>
                  <button className="quick-add" onClick={() => addToCart(product)} aria-label={`Thêm ${product.name} vào giỏ`}>+</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-results">
            <span aria-hidden="true">⌕</span>
            <h3>Chưa thấy món này</h3>
            <p>Thử từ khóa khác hoặc xem tất cả đồ đang có nhé.</p>
            <button className="text-button" onClick={() => { setSearch(""); setActiveCategory("Tất cả"); }}>Xem tất cả món đồ</button>
          </div>
        )}
      </section>

      <section className="seller-band" id="cach-hoat-dong">
        <div className="seller-illustration" aria-hidden="true">
          <span className="orbit orbit-one" /><span className="orbit orbit-two" />
          <span className="box-icon">↗</span><span className="small-star">✳</span>
        </div>
        <div className="seller-copy">
          <p className="section-kicker">Đang dọn nhà?</p>
          <h2>Đồ bạn không dùng,<br />có thể là món ai đó cần.</h2>
          <p>Chụp vài tấm, kể thật tình trạng. Đăng miễn phí, hẹn người mua gần bạn.</p>
          <button className="button button-dark" onClick={() => setListingOpen(true)}>Đăng món đầu tiên <span aria-hidden="true">↗</span></button>
        </div>
        <div className="seller-stat"><strong>{sellerCount.toLocaleString("vi-VN")}+</strong><span>người bán<br />đã tham gia</span></div>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#" aria-label="Lại Dùng, về đầu trang">
          <span className="brand-mark" aria-hidden="true">l.</span><span className="brand-name">lại dùng<span>®</span></span>
        </a>
        <p>Đồ tốt nên được dùng lâu hơn.</p>
        <span className="footer-credit">Một khu chợ nhỏ, cho những món đồ lớn chuyện.</span>
      </footer>

      {notice && <div className="toast" role="status">{notice}</div>}

      {selectedProduct && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setSelectedProduct(null)}>
          <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <button className="modal-close" onClick={() => setSelectedProduct(null)} aria-label="Đóng">×</button>
            <div className="modal-product-image">
              <Image src={selectedProduct.imageUrl} alt={selectedProduct.name} fill sizes="(max-width: 700px) 90vw, 45vw" />
            </div>
            <div className="modal-product-copy">
              <p className="section-kicker">{selectedProduct.category} · {conditionLabels[selectedProduct.condition]}</p>
              <h2 id="detail-title">{selectedProduct.name}</h2>
              <p className="modal-price">{formatPrice(selectedProduct.price)}{selectedProduct.originalPrice && <del>{formatPrice(selectedProduct.originalPrice)}</del>}</p>
              <p className="modal-description">{selectedProduct.description}</p>
              <div className="seller-detail"><span className="seller-avatar">{selectedProduct.seller.slice(0, 1)}</span><p><strong>{selectedProduct.seller}</strong><br />{selectedProduct.location}</p></div>
              <button className="button button-dark modal-add" onClick={() => addToCart(selectedProduct)}>
                {cart.includes(selectedProduct.id) ? "Đã có trong giỏ" : "Thêm vào giỏ"} <span aria-hidden="true">↗</span>
              </button>
              <p className="safe-note">Hẹn xem hàng trực tiếp trước khi nhận nhé.</p>
            </div>
          </section>
        </div>
      )}

      {listingOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setListingOpen(false)}>
          <section className="form-modal" role="dialog" aria-modal="true" aria-labelledby="listing-title">
            <button className="modal-close" onClick={() => setListingOpen(false)} aria-label="Đóng">×</button>
            <p className="section-kicker">Cho món đồ một vòng đời mới</p>
            <h2 id="listing-title">Đăng món đồ</h2>
            <p className="form-intro">Mô tả thật kỹ một chút để người mua dễ hình dung nha.</p>
            <form onSubmit={submitListing}>
              <label>Tên món đồ<input name="name" required minLength={3} maxLength={90} placeholder="Ví dụ: Ghế gỗ xếp gọn" /></label>
              <div className="form-row">
                <label>Giá bán (₫)<input name="price" type="number" min="1000" max="1000000000" step="1000" required placeholder="350000" /></label>
                <label>Tình trạng<select name="condition" defaultValue="GOOD"><option value="LIKE_NEW">Như mới</option><option value="GOOD">Đẹp</option><option value="FAIR">Có dấu dùng</option></select></label>
              </div>
              <label>Danh mục<select name="categorySlug" required defaultValue=""><option value="" disabled>Chọn danh mục</option>{categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}</select></label>
              <label>Mô tả<textarea name="description" required minLength={10} maxLength={1000} rows={3} placeholder="Tình trạng, kích thước, điều người mua nên biết..." /></label>
              <label>Link ảnh (không bắt buộc)<input name="imageUrl" type="url" placeholder="https://images.unsplash.com/..." /></label>
              <div className="form-row">
                <label>Tên bạn<input name="sellerName" required minLength={2} maxLength={60} placeholder="Tên người bán" /></label>
                <label>Khu vực<input name="location" required minLength={2} maxLength={100} placeholder="Quận, thành phố" /></label>
              </div>
              {notice && <p className="form-error" role="alert">{notice}</p>}
              <button className="button button-dark form-submit" type="submit" disabled={submitting}>{submitting ? "Đang đăng..." : "Đăng món đồ miễn phí"}</button>
            </form>
          </section>
        </div>
      )}

      {cartOpen && (
        <div className="modal-backdrop drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setCartOpen(false)}>
          <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
            <div className="drawer-heading"><div><p className="section-kicker">Đồ đang để dành</p><h2 id="cart-title">Giỏ đồ <span>({cart.length})</span></h2></div><button className="modal-close" onClick={() => setCartOpen(false)} aria-label="Đóng">×</button></div>
            {cartProducts.length ? (
              <>
                <div className="cart-items">
                  {cartProducts.map((product) => (
                    <div className="cart-item" key={product.id}>
                      <div className="cart-item-image"><Image src={product.imageUrl} alt="" fill sizes="80px" /></div>
                      <div className="cart-item-copy"><strong>{product.name}</strong><span>{formatPrice(product.price)}</span><button onClick={() => removeFromCart(product.id)}>Bỏ món này</button></div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary"><div><span>Tạm tính</span><strong>{formatPrice(cartTotal)}</strong></div><p>Đơn đặt giúp giữ món, người bán sẽ liên hệ bạn để hẹn nhận hàng.</p><button className="button button-dark" onClick={() => setCheckoutOpen(true)}>Đặt giữ món <span aria-hidden="true">↗</span></button></div>
              </>
            ) : (
              <div className="cart-empty"><span>＋</span><h3>Giỏ còn trống</h3><p>Thấy món nào hợp thì để dành ở đây nhé.</p><button className="button button-dark" onClick={() => setCartOpen(false)}>Đi xem đồ</button></div>
            )}
          </aside>
        </div>
      )}

      {checkoutOpen && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setCheckoutOpen(false)}>
          <section className="form-modal checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
            <button className="modal-close" onClick={() => setCheckoutOpen(false)} aria-label="Đóng">×</button>
            <p className="section-kicker">Chưa cần thanh toán</p>
            <h2 id="checkout-title">Giữ món cho bạn?</h2>
            <p className="form-intro">Để lại thông tin, người bán sẽ liên hệ để hẹn xem và nhận hàng.</p>
            <div className="checkout-total"><span>{cart.length} món trong giỏ</span><strong>{formatPrice(cartTotal)}</strong></div>
            <form onSubmit={submitOrder}>
              <label>Tên của bạn<input name="buyerName" required minLength={2} maxLength={80} placeholder="Tên người nhận" /></label>
              <label>Email liên hệ<input name="buyerEmail" type="email" required placeholder="ban@email.com" /></label>
              {notice && <p className="form-error" role="alert">{notice}</p>}
              <button className="button button-dark form-submit" type="submit" disabled={submitting}>{submitting ? "Đang giữ món..." : "Xác nhận giữ món"}</button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.3 4.3" /></svg>;
}

function CartIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h8a2 2 0 0 0 1.9-1.4L21 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>;
}
