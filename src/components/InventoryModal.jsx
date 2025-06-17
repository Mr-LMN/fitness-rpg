import React from "react";
import "./styles/InventoryModal.css";
import "./styles/Overlay.css";

function InventoryModal({ items = [], onUse, onClose }) {
  return (
    <div className="overlay-bg">
      <div className="inventory-modal">
        <h2>🎒 Inventory</h2>
        {items.length === 0 && <p>No items found.</p>}
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className={`inventory-item rarity-${item.rarity} ${item.isNew ? 'new' : ''}`}
            >
              <div className="item-info">
                <span className="item-name">{item.name}</span>
                {item.type && (
                  <span className="item-type">[{item.type}]</span>
                )}
                <p className="item-desc">{item.description}</p>
              </div>
              {!item.used && (
                <button onClick={() => onUse && onUse(item.id)}>Use</button>
              )}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default InventoryModal;
