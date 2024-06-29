function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const container = document.querySelector('.container');
    sidebar.classList.toggle('expanded');
    container.classList.toggle('expanded');
  }