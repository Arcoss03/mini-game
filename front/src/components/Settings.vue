<script setup lang="ts">

</script>

<template>
    <main class="settings">
        <h1>Paramètres</h1>
        <div class="content">
            <li>
                <label for="theme">Theme</label>
                <select name="theme" class="theme">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                </select>
                <a href="">Mon score CO2</a>
            </li>
        </div>
    </main>
</template>

<style scoped lang="scss">
main {
    //les classes pour le mobile
    min-height: 100vh;
    background-color: #211D2A;
    color: white;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-weight: 400;
    font-style: normal;

    h1 {
        font-size: 2rem;
        margin-top: 20px;
        margin-left: 20px;
    }

    li {
        margin-top: 20px;
        list-style: none;
        display: flex;
        flex-direction: column;
        margin-left: 20px;
    }

    a {
        color: inherit;
        text-decoration: none;
        margin-bottom: 20px;
    }

    .theme {
        width: 100px;
        height: 30px;
        border-radius: 5px;
        background-color: #211D2A;
        color: white;
        border: 1px solid white;
        margin-bottom: 20px;
    }

    //les classes pour le desktop
    @media (min-width: 769px) {
        display: flex;
        flex-direction: column;
        justify-content: start;

        li {
            margin-top: 20px;
            list-style: none;
            display: flex;
            flex-direction: column;
        }

        .content {
            margin-left: 150px;
        }

        h1 {
            margin-left: 150px;
        }
    }
}
</style>
