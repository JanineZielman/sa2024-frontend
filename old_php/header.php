
<header id ="main-header">
    <section class="minimal-nav">
        <ul class="group-1">
            <li><a href="#" class="">News</a></li>
            <li><a href="#" class="">Artists</a></li>
            <li><a href="#" class="">Tickets</a></li>
            <li><a href="#" class="">Visit</a></li>
        </ul>
        <ul>
            <li><a href="#" class="">Programme</a></li>
            <li><a href="#" class="">Timetable</a></li>
            <li><a href="#" class="">Information</a></li>
        </ul>
    </section>
</header>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Select all links inside the header
    const headerLinks = document.querySelectorAll('#main-header a');

    headerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollBy({
          top: window.innerHeight, // 100vh
          behavior: 'smooth'       // default smooth scrolling
        });
      });
    });
  });
</script>
