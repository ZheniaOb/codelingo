import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ShopPage.css";

function ShopPage({ theme, setTheme }) {
	const [items, setItems] = useState([]);
	const [ownedItems, setOwnedItems] = useState(new Set());
	const [equippedTheme, setEquippedTheme] = useState(theme);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [userXp, setUserXp] = useState(null);
	const [showXpModal, setShowXpModal] = useState(false);
	const [showEquipModal, setShowEquipModal] = useState(false);
	const [recentlyBoughtItem, setRecentlyBoughtItem] = useState(null);
	const [justPurchasedId, setJustPurchasedId] = useState(null);
	const [sortBy, setSortBy] = useState("default");
	const [filterBy, setFilterBy] = useState("all");
	const [previewItem, setPreviewItem] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchItems = async () => {
			const token = localStorage.getItem("token");

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

		const fetchUserXp = async () => {
			try {
				const response = await fetch("http://localhost:5001/api/me", {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});
				if (!response.ok) return;
				const data = await response.json();
				setUserXp(typeof data.xp === "number" ? data.xp : 0);
			} catch (e) {
				console.error("Error fetching user XP for shop:", e);
			}
		};

		fetchUserXp();
	}, []);

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
					if (message.toLowerCase().includes("not enough xp")) {
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
				if (!msg.toLowerCase().includes("not enough xp")) {
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

		if (item.item_type === "theme") {
			if (!isOwned) {
				return (
					<button
						className="shop-btn shop-btn-primary"
						onClick={() => handleBuy(item)}
					>
						Buy
					</button>
				);
			}

			const isEquipped = equippedTheme === item.asset_url;
			return (
				<button
					className={`shop-btn shop-btn-primary ${
						isEquipped ? "shop-btn-equipped" : ""
					}`}
					onClick={() => handleEquipTheme(item)}
				>
					{isEquipped ? "✔ Equipped" : "Apply"}
				</button>
			);
		}

		if (isOwned) {
			return <span className="shop-owned-badge">Owned</span>;
		}

		return (
			<button
				className="shop-btn shop-btn-primary"
				onClick={() => handleBuy(item)}
			>
				Buy
			</button>
		);
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
			result.sort((a, b) => (a.price_xp || 0) - (b.price_xp || 0));
		} else if (sortBy === "price-desc") {
			result.sort((a, b) => (b.price_xp || 0) - (a.price_xp || 0));
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
							Spend your XP to unlock new avatars and themes.
						</p>
					</div>
				</header>

				<div className="shop-toolbar">
					{userXp !== null && (
						<div className="shop-xp-pill">
							<span className="shop-xp-label">Your XP</span>
							<span className="shop-xp-value">{userXp}</span>
						</div>
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
									<div className="shop-theme-preview shop-theme-preview-pink" />
								</div>
								<div className="shop-card-body">
									<h3 className="shop-item-name">{item.name}</h3>
									<p className="shop-item-description">{item.description}</p>
									<div className="shop-card-footer">
										<span className="shop-price">{item.price_xp} XP</span>
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
										<span className="shop-price">{item.price_xp} XP</span>
										{renderActionButton(item)}
									</div>
								</div>
							</article>
						))}
					</div>
				</section>
			</div>

			{showXpModal && (
				<div
					className="shop-modal-backdrop"
					onClick={() => setShowXpModal(false)}
				>
					<div
						className="shop-modal"
						onClick={(e) => e.stopPropagation()}
					>
						<h4 className="shop-modal-title">Not enough XP</h4>
						<p className="shop-modal-text">
							You do not have enough XP to buy this item.
						</p>
						<div className="shop-modal-actions">
							<button
								type="button"
								className="btn btn-cta"
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

