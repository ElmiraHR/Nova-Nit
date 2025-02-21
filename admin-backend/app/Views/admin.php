<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">

    <title>Admin Panel</title>


</head>
<body>
    <h1>Welcome to the Admin Panel!</h1>
    <p>You are successfully logged in.</p>
    <a href="/logout" style="cursor: pointer; color: blue; text-decoration: underline;">Logout</a>

    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const logoutLink = document.querySelector('a[href="/logout"]');
        if (logoutLink) {
            logoutLink.style.pointerEvents = 'auto';
            logoutLink.style.zIndex = '10000';

            logoutLink.addEventListener('click', (e) => {
                console.log('Logout clicked');
            });
        }
    });
</script>



</body>
</html>
