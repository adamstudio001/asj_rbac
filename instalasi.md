# 🧱 ASJ RBAC

**Role-Based Access Control (RBAC) System** menggunakan **React + Vite + TailwindCSS**, dirancang untuk performa tinggi dan kemudahan pengembangan.  

---

## ⚙️ Teknologi Utama

- ⚛️ **React 19**  
- ⚡ **Vite 7**  
- 🎨 **TailwindCSS 4**  
- 🧩 **Radix UI + Lucide Icons**  
- 🎭 **Framer Motion**  
- 🧠 **React Hook Form**  
- 🧹 **ESLint 9**

---

## 🧰 Persiapan Awal

Pastikan Anda sudah menginstal:

- [Node.js](https://nodejs.org/) versi **22.13.1** atau lebih baru

---

## 📥 Instalasi

Langkah-langkah untuk menjalankan proyek di mode developer:

```bash
# 1️⃣ Clone repository
git clone https://github.com/adamf0/asj_rbac.git

# 2️⃣ Masuk ke folder project
cd asj_rbac

# 3️⃣ Install dependencies
npm install

# 4️⃣ Jalankan project di mode development
npm run dev
```

---

## 🚀 Deploy Production

Langkah-langkah untuk menjalankan proyek di mode production:

```bash
# 1️⃣ build project
npm run build

# 2️⃣ Install dependencies untuk runner
npm install -g serve

# 3️⃣ jalankan project
serve -s /dist -l 3000 
```

---

Langkah-langkah untuk menjalankan proyek di mode production (versi docker):

```bash
docker compose up -d
```