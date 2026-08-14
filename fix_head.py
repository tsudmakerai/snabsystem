import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    index = f.read()

original_head = """<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<link rel="shortcut icon" href="/assets/images/favicon.ico" type="image/vnd.microsoft.icon" />
<meta name="description" content="Мы предлагаем продажу промышленного оборудования с доставкой по России. Наша компания предлагает выгодные цены, бесплатную доставку и гарантийное обслуживание оборудования." />
<meta name="keywords" content="продажа промышленного оборудования, продажа оборудования" />
<meta name="generator" content="snabsystem (http://snabsystem.ru)" />
<link rel="image_src" href="/assets/images/snabsystem-logo.png" />
<link rel="canonical" href="https://snabsystem.ru/" />
<link rel="shortlink" href="https://snabsystem.ru/" />
    <title>Продажа промышленного оборудования - Система Снабжения</title>
    <link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700,400italic&subset=latin,cyrillic-ext' rel='stylesheet' type='text/css'>
    <link type="text/css" rel="stylesheet" href="/css/style.css" media="all" />
    <!--[if lt IE 9]>
      <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/r29/html5.min.js"></script>
      <script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.1.0/respond.min.js"></script>
    <![endif]-->
</head>"""

index = re.sub(r'<head>.*?</head>', original_head, index, flags=re.DOTALL)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(index)

print('Updated index.html head')
