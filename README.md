# Online Quiz / Exam System

React (Vite) tabanlı frontend ve FastAPI tabanlı backend içeren tam yığın bir sınav ve quiz uygulamasıdır. Veritabanı olarak MySQL kullanılır.

## Gereksinimler

Aşağıdakilerden **bir yöntemi** seçmeniz yeterlidir.

| Yöntem | Gerekenler |
|--------|------------|
| **Docker (önerilen)** | [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Docker Compose dahil) |
| **Yerel geliştirme** | Node.js 20+, Python 3.12+, çalışan bir MySQL 8 sunucusu |

---

## Hızlı başlangıç: Docker ile çalıştırma

Proje kökünde (`online-quiz-system` klasöründe) terminal açın:

```bash
cd online-quiz-system
docker compose up --build
```

İlk kurulumda imajlar iner ve build biraz sürebilir.

### Erişim adresleri

| Servis | Adres |
|--------|--------|
| **Frontend** | [http://localhost:5173](http://localhost:5173) |
| **Backend API** | [http://localhost:8000](http://localhost:8000) |
| **API dokümantasyonu (Swagger)** | [http://localhost:8000/docs](http://localhost:8000/docs) |
| **Sağlık kontrolü** | [http://localhost:8000/health](http://localhost:8000/health) |
| **MySQL (host makineden)** | `localhost:3307` (kullanıcı: `root`, şifre: `compose` içindeki değer; varsayılan: `password`) |

### Durdurma

```bash
docker compose down
```

Veritabanı verisini de silmek isterseniz:

```bash
docker compose down -v
```

---

## Yerel geliştirme (Docker olmadan)

### 1. MySQL

MySQL 8 çalışır durumda olmalı. Örnek: sadece veritabanını Docker ile ayağa kaldırmak:

```bash
cd online-quiz-system
docker compose up -d db
```

Bu durumda MySQL host üzerinden **3307** portundan erişilir.

### 2. Backend (FastAPI)

```bash
cd online-quiz-system/backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Ortam değişkenleri için proje kökündeki `.env` dosyasını kullanın veya `DATABASE_URL` değerini kendi MySQL adresinize göre ayarlayın. Yerel geliştirmede örnek (Docker’daki `db` servisi 3307’ye map edildiyse):

```bash
export DATABASE_URL="mysql+pymysql://root:password@127.0.0.1:3307/quiz_system"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend (Vite)

Yeni bir terminalde:

```bash
cd online-quiz-system/frontend
npm install
npm run dev
```

Varsayılan adres: [http://localhost:5173](http://localhost:5173).  
`vite.config.js` içinde `/api` istekleri geliştirme modunda `http://localhost:8000` adresine yönlendirilir.

---

## Ortam değişkenleri

Kök dizinde `.env` örneği (Docker Compose backend servisi bunu okur):

- `DATABASE_URL` — SQLAlchemy bağlantı dizesi
- `SECRET_KEY` — JWT için gizli anahtar
- `ALGORITHM` — Varsayılan: `HS256`
- `ACCESS_TOKEN_EXPIRE_MINUTES` — Erişim token süresi (dakika)

Üretim ortamında `SECRET_KEY` ve veritabanı şifrelerini mutlaka güçlü ve gizli tutun.

---

## Sorun giderme

### `vite: Permission denied` veya macOS’ta `bad interpreter`

Projeyi WhatsApp vb. ile taşıdıysanız `node_modules` içindeki dosyalar **quarantine** ile işaretlenebilir. Çözüm örnekleri:

```bash
cd online-quiz-system/frontend
rm -rf node_modules
npm install
```

Gerekirse (dikkatli kullanın):

```bash
xattr -dr com.apple.quarantine node_modules
```

### Docker build sırasında frontend `vite` hatası

`frontend/.dockerignore` içinde `node_modules` ve `dist` olmalıdır; böylece host’taki `node_modules` imaja kopyalanmaz ve build bozulmaz.

### Port çakışması

- `8000`, `5173` veya `3307` kullanımdaysa `docker-compose.yml` içindeki port eşlemelerini değiştirin veya ilgili süreci durdurun.

---

## Proje yapısı (kısa)

```
online-quiz-system/
├── backend/          # FastAPI, SQLAlchemy, Alembic
├── frontend/         # React + Vite + Tailwind
├── docker-compose.yml
├── .env              # Örnek ortam (gizli bilgileri repoya koymayın)
└── README.md
```

---

## Lisans

Bu depo eğitim / proje amaçlıdır; lisans bilgisi yoksa kurumunuzun politikasına göre ekleyin.
