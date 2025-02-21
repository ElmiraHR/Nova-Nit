<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Login</title>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <meta http-equiv="Pragma" content="no-cache">
    <meta http-equiv="Expires" content="0">
</head>
<body>
    <h2>Login to Admin Panel</h2>

    <?php if (session()->getFlashdata('msg')): ?>
        <p style="color:red"><?= session()->getFlashdata('msg') ?></p>
    <?php endif; ?>

    <form method="post" action="/login/auth">
        <label>Username:</label><br>
        <input type="text" name="username" required><br><br>

        <label>Password:</label><br>
        <input type="password" name="password" required><br><br>

        <label>Enter Captcha:</label><br>
        <input type="text" name="captcha" required><br><br>

        <img src="/captcha" alt="Captcha"><br><br>

        <button type="submit">Login</button>
    </form>

    <script>
        // Очистка потенциальных JS-блокировок
        window.onload = function () {
            document.querySelectorAll('*').forEach(el => {
                el.style.pointerEvents = 'auto';
                el.style.zIndex = '1';
            });
            console.log("UI разблокирован");
        };
    </script>

</body>
</html>
