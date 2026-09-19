import React, { useEffect, useRef, useState } from "react";

const CATEGORIES = ["Snacks", "Drinks", "Apparel"];

export default function InventoryManager({ products, setProducts }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Always release the camera when this component unmounts or the
    // camera is turned off — don't leave the light on in the background.
    return () => stopCamera();
  }, []);

  async function startCamera() {
    setCameraError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraOn(true);
    } catch (err) {
      setCameraError(
        "Couldn't access the camera. Check your browser/site permissions."
      );
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  }

  function capturePhoto() {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    setPhoto(canvas.toDataURL("image/jpeg", 0.85));
    stopCamera();
  }

  function resetForm() {
    setName("");
    setCategory(CATEGORIES[0]);
    setPrice("");
    setDescription("");
    setPhoto(null);
  }

  function handleAdd(e) {
    e.preventDefault();
    const priceNum = parseFloat(price);
    if (!name.trim() || Number.isNaN(priceNum)) return;
    const newProduct = {
      id: `p${Date.now()}`,
      name: name.trim(),
      category,
      price: priceNum,
      description: description.trim(),
      image: photo,
    };
    setProducts((prev) => [newProduct, ...prev]);
    resetForm();
  }

  function handleDelete(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="inventory">
      <section className="form-section">
        <h3>Add item</h3>
        <form onSubmit={handleAdd} className="form">
          <label>
            Name
            <input value={name} onChange={(e) => setName(e.target.value)} required />
          </label>
          <label>
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label>
            Price (£)
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </label>

          <div className="camera-block">
            {!cameraOn && !photo && (
              <button type="button" className="secondary" onClick={startCamera}>
                Open camera
              </button>
            )}

            {cameraOn && (
              <div className="camera-live">
                <video ref={videoRef} autoPlay playsInline muted />
                <div className="row-gap">
                  <button type="button" onClick={capturePhoto}>
                    Capture
                  </button>
                  <button type="button" className="secondary" onClick={stopCamera}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {photo && (
              <div className="camera-preview">
                <img src={photo} alt="Captured item" />
                <button type="button" className="text-btn" onClick={() => setPhoto(null)}>
                  Retake
                </button>
              </div>
            )}

            {cameraError && <p className="error">{cameraError}</p>}
          </div>

          <button type="submit">Add to catalog</button>
        </form>
      </section>

      <section>
        <h3>Current catalog ({products.length})</h3>
        <ul className="inventory-list">
          {products.map((p) => (
            <li key={p.id} className="inventory-row">
              <div className="thumb small">
                {p.image ? (
                  <img src={p.image} alt={p.name} />
                ) : (
                  <div className="thumb-placeholder">{p.category}</div>
                )}
              </div>
              <div className="inventory-info">
                <strong>{p.name}</strong>
                <span className="muted">
                  {p.category} · £{p.price.toFixed(2)}
                </span>
              </div>
              <button className="text-btn" onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
