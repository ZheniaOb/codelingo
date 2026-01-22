import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShopPage.css";

function ShopPage({ theme, setTheme }) {
	const [items, setItems] = useState([]);
	const [ownedItems, setOwnedItems] = useState(new Set());
	const [equippedTheme, setEquippedTheme] = useState(theme);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [userCoins, setUserCoins] = useState(null);
	const [currentAvatar, setCurrentAvatar] = useState(null);
	const [showXpModal, setShowXpModal] = useState(false);
	const [showEquipModal, setShowEquipModal] = useState(false);
	const [showEarnCoinsModal, setShowEarnCoinsModal] = useState(false);
	const [recentlyBoughtItem, setRecentlyBoughtItem] = useState(null);
	const [justPurchasedId, setJustPurchasedId] = useState(null);
	const [sortBy, setSortBy] = useState("default");
	const [filterBy, setFilterBy] = useState("all");
	const [previewItem, setPreviewItem] = useState(null);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchItems = async () => {
			const token = localStorage.getItem("token");
			setIsLoggedIn(!!token);

			try {
				const response = await fetch(
					"http://localhost:5001/api/shop/items",
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: token ? `Bearer ${token}` : "",
						},
					}
				);

				if (!response.ok) {
					throw new Error("Failed to load shop items");
				}

				const data = await response.json();
				setItems(data || []);
				const initiallyOwned = new Set(
					(data || [])
						.filter((item) => item.owned)
						.map((item) => item.id)
				);
				setOwnedItems(initiallyOwned);
			} catch (err) {
				console.error("Error loading shop items:", err);
				setError(err.message || "Failed to load shop items");
			} finally {
				setLoading(false);
			}
		};

		fetchItems();
	}, []);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) return;

		const fetchUserCurrency = async () => {
			try {
				const response = await fetch("http://localhost:5001/api/me", {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});
				if (!response.ok) return;
				const data = await response.json();
				setUserCoins(typeof data.coins === "number" ? data.coins : 0);
				if (data && typeof data.avatar === "string") {
					setCurrentAvatar(data.avatar);
				}
			} catch (e) {
				console.error("Error fetching user currency for shop:", e);
			}
		};

		fetchUserCurrency();
	}, []);

	const handleEquipAvatar = (item) => {
		const token = localStorage.getItem("token");
		if (!token) {
			setError("You need to be logged in to apply avatars.");
			return;
		}

		setError(null);

		fetch("http://localhost:5001/api/me", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ avatar: item.asset_url }),
		})
			.finally(() => {
				setCurrentAvatar(item.asset_url);
				window.location.reload();
			});
	};

	const handleBuy = (item) => {
		const token = localStorage.getItem("token");
		if (!token) {
			setError("You need to be logged in to buy items.");
			return;
		}

		setError(null);

		fetch("http://localhost:5001/api/shop/buy", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ item_id: item.id }),
		})
			.then(async (response) => {
				const data = await response.json().catch(() => ({}));
				if (!response.ok) {
					const message = data.error || "Failed to buy item";
					if (message.toLowerCase().includes("not enough coins")) {
						setShowXpModal(true);
					}
					throw new Error(message);
				}
				setOwnedItems((prev) => {
					const next = new Set(prev);
					next.add(item.id);
					return next;
				});
				setRecentlyBoughtItem(item);
				setShowEquipModal(true);
				setJustPurchasedId(item.id);
				setTimeout(() => setJustPurchasedId(null), 700);
			})
			.catch((err) => {
				console.error("Error buying item:", err);
				const msg = err.message || "Failed to buy item";
				if (!msg.toLowerCase().includes("not enough coins")) {
					setError(msg);
				}
			});
	};

	const handleConfirmEquip = () => {
		if (!recentlyBoughtItem) {
			return;
		}

		if (recentlyBoughtItem.item_type === "theme") {
			handleEquipTheme(recentlyBoughtItem);
			setShowEquipModal(false);
			setRecentlyBoughtItem(null);
			return;
		}

		if (recentlyBoughtItem.item_type === "avatar") {
			const token = localStorage.getItem("token");
			if (!token) {
				setShowEquipModal(false);
				setRecentlyBoughtItem(null);
				return;
			}

			fetch("http://localhost:5001/api/me", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					avatar: recentlyBoughtItem.asset_url,
				}),
			})
				.finally(() => {
					setShowEquipModal(false);
					setRecentlyBoughtItem(null);
					window.location.reload();
				});
		}
	};

	const handleEquipTheme = (item) => {
		if (!ownedItems.has(item.id)) {
			setError("You need to buy this theme before applying it.");
			return;
		}

		if (item.asset_url === "pink") {
			setTheme("pink");
			setEquippedTheme("pink");
		}
	};

	const renderActionButton = (item) => {
		const isOwned = ownedItems.has(item.id);
		const isUnavailable = item.is_available === false;

		if (item.item_type === "theme") {
			if (isUnavailable) {
				return (
					<span className="shop-owned-badge shop-owned-unavailable">
						Unavailable
					</span>
				);
			}
			if (!isOwned) {
				const canAfford = isLoggedIn && userCoins !== null && userCoins >= (item.price_coins || 0);
				const isDisabled = isLoggedIn && !canAfford;
				return (
					<button
						className={`shop-btn shop-btn-primary shop-btn-buy ${isDisabled ? 'shop-btn-disabled' : ''}`}
						onClick={() => isLoggedIn ? handleBuy(item) : navigate('/login')}
						disabled={isDisabled}
						title={isDisabled ? `Not enough coins. You need ${item.price_coins || 0} coins.` : ''}
					>
						{isLoggedIn ? 'Buy' : 'Log in to buy'}
					</button>
				);
			}

			const isEquipped = equippedTheme === item.asset_url;
			return (
				<button
					className={`shop-btn ${
						isEquipped
							? "shop-btn-primary shop-btn-equipped"
							: "shop-btn-apply"
					}`}
					onClick={() => handleEquipTheme(item)}
				>
					{isEquipped ? "✔ Equipped" : "Apply"}
				</button>
			);
		}

		if (item.item_type === "avatar") {
			if (isUnavailable) {
				return (
					<span className="shop-owned-badge shop-owned-unavailable">
						Unavailable
					</span>
				);
			}

			if (!isOwned) {
				const canAfford = isLoggedIn && userCoins !== null && userCoins >= (item.price_coins || 0);
				const isDisabled = isLoggedIn && !canAfford;
				return (
					<button
						className={`shop-btn shop-btn-primary shop-btn-buy ${isDisabled ? 'shop-btn-disabled' : ''}`}
						onClick={() => isLoggedIn ? handleBuy(item) : navigate('/login')}
						disabled={isDisabled}
						title={isDisabled ? `Not enough coins. You need ${item.price_coins || 0} coins.` : ''}
					>
						{isLoggedIn ? 'Buy' : 'Log in to buy'}
					</button>
				);
			}

			const isEquippedAvatar = currentAvatar === item.asset_url;
			if (isEquippedAvatar) {
				// For equipped avatars we already show a small badge,
				// so no extra button is needed here.
				return null;
			}

			return (
				<button
					className="shop-btn shop-btn-apply"
					onClick={() => handleEquipAvatar(item)}
				>
					Apply
				</button>
			);
		}

		// Fallback for any other item types
		if (!isOwned) {
			const canAfford = isLoggedIn && userCoins !== null && userCoins >= (item.price_coins || 0);
			const isDisabled = isLoggedIn && !canAfford;
			return (
				<button
					className={`shop-btn shop-btn-primary ${isDisabled ? 'shop-btn-disabled' : ''}`}
					onClick={() => isLoggedIn ? handleBuy(item) : navigate('/login')}
					disabled={isDisabled}
					title={isDisabled ? `Not enough coins. You need ${item.price_coins || 0} coins.` : ''}
				>
					{isLoggedIn ? 'Buy' : 'Log in to buy'}
				</button>
			);
		}

		return <span className="shop-owned-badge">Owned</span>;
	};

	const themeItemsRaw = items.filter((item) => item.item_type === "theme");
	const avatarItemsRaw = items.filter((item) => item.item_type === "avatar");

	const applyFilterAndSort = (list) => {
		let result = [...list];

		if (filterBy === "owned") {
			result = result.filter((item) => ownedItems.has(item.id));
		} else if (filterBy === "available") {
			result = result.filter((item) => !ownedItems.has(item.id));
		}

		if (sortBy === "price-asc") {
			result.sort((a, b) => (a.price_coins || 0) - (b.price_coins || 0));
		} else if (sortBy === "price-desc") {
			result.sort((a, b) => (b.price_coins || 0) - (a.price_coins || 0));
		} else if (sortBy === "name-asc") {
			result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
		}

		return result;
	};

	const themeItems = applyFilterAndSort(themeItemsRaw);
	const avatarItems = applyFilterAndSort(avatarItemsRaw);

	const openPreview = (item) => {
		setPreviewItem(item);
	};

	const closePreview = () => {
		setPreviewItem(null);
	};

	return (
		<main className="shop-page-wrapper">
			<div className="shop-container container">
				{loading && (
					<p className="shop-subtitle">Loading shop items...</p>
				)}
				{!loading && error && (
					<p className="shop-subtitle" style={{ color: "red" }}>
						{error}
					</p>
				)}
				<header className="shop-header">
					<div>
						<h1 className="shop-title">Customization Shop</h1>
						<p className="shop-subtitle">
							Spend your coins to unlock new avatars and themes.
						</p>
					</div>
				</header>

				<div className="shop-toolbar">
					{isLoggedIn && userCoins !== null && (
						<div className="shop-xp-pill">
							<span className="shop-xp-label">Your coins</span>
							<span className="shop-xp-value">{userCoins}</span>						<button 
							className="shop-info-btn"
							onClick={() => setShowEarnCoinsModal(true)}
							title="How to earn coins"
						>
							💡
						</button>						</div>
					)}
					<div className="shop-toolbar-controls">
						<div className="shop-toolbar-group">
							<label className="shop-toolbar-label" htmlFor="shop-filter">
								Filter
							</label>
							<select
								id="shop-filter"
								className="shop-toolbar-select"
								value={filterBy}
								onChange={(e) => setFilterBy(e.target.value)}
							>
								<option value="all">All items</option>
								<option value="owned">Owned</option>
								<option value="available">Available to buy</option>
							</select>
						</div>
						<div className="shop-toolbar-group">
							<label className="shop-toolbar-label" htmlFor="shop-sort">
								Sort by
							</label>
							<select
								id="shop-sort"
								className="shop-toolbar-select"
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
							>
								<option value="default">Default</option>
								<option value="price-asc">Price: low to high</option>
								<option value="price-desc">Price: high to low</option>
								<option value="name-asc">Name A-Z</option>
							</select>
						</div>
					</div>
				</div>

				<section className="shop-section">
					<h2 className="shop-section-title">Themes</h2>
					<div className="shop-grid">
						{themeItems.map((item) => (
							<article
								key={item.id}
								className={`shop-card shop-card-theme ${
									justPurchasedId === item.id ? "shop-card-purchased" : ""
								}`}
							>
								<div
									className="shop-card-preview shop-card-preview-theme"
									onClick={() => openPreview(item)}
								>
									<span className="shop-tag">Theme</span>
								<div 
									className="shop-theme-preview"
									style={{
										background: item.asset_url === 'pink' 
											? 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)'
											: item.asset_url === 'dark'
											? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
											: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)'
									}}
								/>
								</div>
								<div className="shop-card-body">
									<h3 className="shop-item-name">{item.name}</h3>
									<p className="shop-item-description">{item.description}</p>
									<div className="shop-card-footer">
										<div className="shop-card-meta">
											<span className="shop-price">{item.price_coins} coins</span>
											{ownedItems.has(item.id) && (
												<span
													className={`shop-owned-badge ${
														equippedTheme === item.asset_url
															? "shop-owned-badge-active"
															: ""
													}`}
												>
													{equippedTheme === item.asset_url ? "Active" : "Owned"}
												</span>
											)}
										</div>
										{renderActionButton(item)}
									</div>
								</div>
							</article>
						))}
					</div>
				</section>

				<section className="shop-section">
					<h2 className="shop-section-title">Avatars</h2>
					<div className="shop-grid">
						{avatarItems.map((item) => (
							<article
								key={item.id}
								className={`shop-card shop-card-avatar ${
									justPurchasedId === item.id ? "shop-card-purchased" : ""
								}`}
							>
								<div
									className="shop-card-preview"
									onClick={() => openPreview(item)}
								>
									<span className="shop-tag">Avatar</span>
									<div className="shop-avatar-wrapper">
										<img
											src={item.asset_url}
											alt={item.name}
											className="shop-avatar-image"
										/>
									</div>
								</div>
								<div className="shop-card-body">
									<h3 className="shop-item-name">{item.name}</h3>
									<p className="shop-item-description">{item.description}</p>
									<div className="shop-card-footer">
										<div className="shop-card-meta">
											<span className="shop-price">{item.price_coins} coins</span>
											{ownedItems.has(item.id) && (
												<span
													className={`shop-owned-badge ${
														currentAvatar === item.asset_url
															? "shop-owned-badge-active"
															: ""
													}`}
												>
													{currentAvatar === item.asset_url ? "Equipped" : "Owned"}
												</span>
											)}
										</div>
										{renderActionButton(item)}
									</div>
								</div>
							</article>
						))}
					</div>
				</section>
			</div>

			{previewItem && (
				<div
					className="shop-modal-backdrop shop-modal-backdrop-light"
					onClick={closePreview}
				>
					<div
						className="shop-modal shop-modal-preview"
						onClick={(e) => e.stopPropagation()}
					>
						<h4 className="shop-modal-title">
							{previewItem.item_type === "theme"
								? "Theme preview"
								: "Avatar preview"}
						</h4>
						{previewItem.item_type === "theme" ? (
							<div className="shop-preview-theme-box">
							<div 
								className="shop-preview-theme-mockup"
								style={{
									background: previewItem.asset_url === 'pink' 
										? 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)'
										: previewItem.asset_url === 'dark'
										? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
										: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)'
								}}
							>
								<div className="shop-preview-header">
									<div className="shop-preview-logo">CodeLingo</div>
									<div className="shop-preview-nav">
										<span className="shop-preview-nav-item">Home</span>
										<span className="shop-preview-nav-item">Courses</span>
										<span className="shop-preview-nav-item">Shop</span>
									</div>
								</div>
								<div className="shop-preview-body">
									<div className="shop-preview-card">
										<div className="shop-preview-card-header"></div>
										<div className="shop-preview-card-content">
											<div className="shop-preview-line"></div>
											<div className="shop-preview-line shop-preview-line-short"></div>
										</div>
									</div>
								</div>
							</div>
							</div>
						) : (
							<div className="shop-preview-avatar-row">
								<div className="shop-preview-avatar-circle">
									<img
										src={previewItem.asset_url}
										alt={previewItem.name}
									/>
								</div>
								<div className="shop-preview-avatar-text">
									<div className="shop-preview-line" />
									<div className="shop-preview-line shop-preview-line-faded" />
								</div>
							</div>
						)}
						<div className="shop-modal-actions">
							<button
								type="button"
								className="btn btn-cta shop-modal-btn-secondary"
								onClick={closePreview}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{showEarnCoinsModal && (
				<div
					className="shop-modal-backdrop"
					onClick={() => setShowEarnCoinsModal(false)}
				>
					<div
						className="shop-modal"
						onClick={(e) => e.stopPropagation()}
					>
						<h4 className="shop-modal-title">💰 How to Earn Coins</h4>
						<p className="shop-modal-text">
							Coins are the in-game currency you can use to unlock awesome themes 
							and avatars in the shop!
						</p>
						<div className="shop-modal-text" style={{ marginTop: '1rem', padding: '1.25rem', backgroundColor: '#f0f9ff', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
							<strong style={{ fontSize: '1.05rem', color: '#1e40af' }}>💡 Ways to earn coins:</strong>
							<ul style={{ marginTop: '0.75rem', marginBottom: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
								<li><strong>Complete lessons:</strong> Earn 100-200 XP per lesson → 50-100 coins</li>
								<li><strong>Play mini-games:</strong> Win up to 50 coins per game</li>
								<li><strong>Daily challenges:</strong> Complete daily tasks for 25 coins</li>
								<li><strong>Keep your streak:</strong> Consistent daily activity rewards bonus XP</li>
							</ul>
							<div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#dbeafe', borderRadius: '8px', textAlign: 'center' }}>
								<strong style={{ fontSize: '1.1rem', color: '#1e40af' }}>✨ 2 XP = 1 Coin ✨</strong>
							</div>
						</div>
						<div className="shop-modal-actions">
							<button
								type="button"
								className="shop-btn shop-btn-primary"
								onClick={() => {
									setShowEarnCoinsModal(false);
									navigate('/courses');
								}}
							>
								📚 Start Learning
							</button>
							<button
								type="button"
								className="shop-btn shop-btn-secondary"
								onClick={() => setShowEarnCoinsModal(false)}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{showXpModal && (
				<div
					className="shop-modal-backdrop"
					onClick={() => setShowXpModal(false)}
				>
					<div
						className="shop-modal"
						onClick={(e) => e.stopPropagation()}
					>
						<h4 className="shop-modal-title">💰 Not enough coins</h4>
						<p className="shop-modal-text">
							You do not have enough coins to buy this item.
						</p>
						<div className="shop-modal-text" style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
							<strong>💡 How to earn coins:</strong>
							<ul style={{ marginTop: '0.5rem', marginBottom: 0, paddingLeft: '1.5rem' }}>
								<li>Complete lessons (100-200 XP → 50-100 coins)</li>
								<li>Play mini-games (up to 50 coins per game)</li>
								<li>Finish daily challenges (25 coins)</li>
								<li><strong>2 XP = 1 coin</strong></li>
							</ul>
						</div>
						<div className="shop-modal-actions">
							<button
								type="button"
								className="shop-btn shop-btn-primary"
								onClick={() => {
									setShowXpModal(false);
									navigate('/courses');
								}}
							>
								Go to Courses
							</button>
							<button
								type="button"
								className="shop-btn shop-btn-secondary"
								onClick={() => setShowXpModal(false)}
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{showEquipModal && recentlyBoughtItem && (
				<div
					className="shop-modal-backdrop shop-modal-backdrop-light"
					onClick={() => setShowEquipModal(false)}
				>
					<div
						className="shop-modal shop-modal-equip"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="shop-modal-header">
							<div className="shop-modal-icon">✨</div>
							<div>
								<h4 className="shop-modal-title">
									{recentlyBoughtItem.item_type === "theme"
										? "Apply theme now?"
										: "Equip avatar now?"}
								</h4>
								<p className="shop-modal-subtitle">
									You just bought "{recentlyBoughtItem.name}".
								</p>
							</div>
						</div>
						<p className="shop-modal-text">
							{recentlyBoughtItem.item_type === "theme"
								? "Do you want to apply this theme right away?"
								: "Do you want to set this avatar right away?"}
						</p>
						<div className="shop-modal-actions">
							<button
								type="button"
								className="btn btn-cta shop-modal-btn-secondary"
								onClick={() => setShowEquipModal(false)}
							>
								Not now
							</button>
							<button
								type="button"
								className="btn btn-cta shop-modal-btn-primary"
								onClick={handleConfirmEquip}
							>
								Apply
							</button>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}

export default ShopPage;

