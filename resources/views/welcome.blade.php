<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Joanitha Blog</title>

    <style>
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        body{
            background: #f4f4f4;
            color: #333;
        }

        /* Navbar */
        nav{
            background: white;
            padding: 20px 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        nav h1{
            color: #2563eb;
        }

        nav ul{
            display: flex;
            list-style: none;
            gap: 20px;
        }

        nav a{
            text-decoration: none;
            color: #333;
            font-weight: bold;
        }

        nav a:hover{
            color: #2563eb;
        }

        /* Hero */
        .hero{
            background: #2563eb;
            color: white;
            text-align: center;
            padding: 80px 20px;
        }

        .hero h2{
            font-size: 45px;
            margin-bottom: 15px;
        }

        .hero p{
            font-size: 18px;
        }

        /* Blog Section */
        .blog{
            padding: 50px;
        }

        .blog-title{
            text-align: center;
            margin-bottom: 40px;
            font-size: 35px;
        }

        .cards{
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .card{
            background: white;
            width: 300px;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .card h3{
            margin-bottom: 15px;
        }

        .card p{
            margin-bottom: 20px;
            color: #666;
        }

        .card button{
            background: #2563eb;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
        }

        .card button:hover{
            background: #1d4ed8;
        }

        /* Footer */
        footer{
            background: #111827;
            color: white;
            text-align: center;
            padding: 20px;
            margin-top: 40px;
        }
    </style>
</head>

<body>

    <!-- Navbar -->
    <nav>
        <h1>Joanitha Blog</h1>

        <ul>
            <li><a href="#">Accueil</a></li>
            <li><a href="#">Articles</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
    </nav>

    <!-- Hero -->
    <section class="hero">
        <h2>Bienvenue sur mon Blog</h2>

        <p>
            Découvrez des articles sur Laravel,
            le développement web et la technologie.
        </p>
    </section>

    <!-- Blog -->
    <section class="blog">

        <h2 class="blog-title">
            Derniers Articles
        </h2>

        <div class="cards">

            <div class="card">
                <h3>Introduction à Laravel</h3>

                <p>
                    Découvrez les bases du framework Laravel
                    pour créer des applications modernes.
                </p>

                <button>Lire plus</button>
            </div>

            <div class="card">
                <h3>Créer une API REST</h3>

                <p>
                    Apprenez à construire une API REST
                    avec Laravel Sanctum.
                </p>

                <button>Lire plus</button>
            </div>

            <div class="card">
                <h3>Apprendre CSS</h3>

                <p>
                    Maîtrisez les bases du CSS pour créer
                    des interfaces modernes.
                </p>

                <button>Lire plus</button>
            </div>

        </div>

    </section>

    <!-- Footer -->
    <footer>
        <p>© 2026 Joanitha Blog - Tous droits réservés</p>
    </footer>

</body>
</html>