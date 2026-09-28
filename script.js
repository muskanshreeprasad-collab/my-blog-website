const container = document.getElementById("blogContainer");
const searchInput = document.getElementById("searchInput");
const noResults = document.getElementById("noResults");
const blogForm = document.getElementById("blogForm");
const themeBtn = document.getElementById("themeBtn");
const filters = document.getElementById("filters");

// Sample blog posts
const sampleBlogs = [
  {
    id: "1",
    title: "The Future of Artificial Intelligence",
    category: "Technology",
    content: "AI is changing how we learn, work, and solve problems. The future brings exciting possibilities for people who use technology creatively.",
    date: "Featured story"
  },
  {
    id: "2",
    title: "Small Habits, Big Changes",
    category: "Lifestyle",
    content: "Real growth begins with small steps. Build a routine, take breaks, stay curious, and celebrate your progress every day.",
    date: "5 min read"
  },
  {
    id: "3",
    title: "Why Every Student Should Learn Coding",
    category: "Education",
    content: "Coding builds logical thinking, creativity, and problem-solving skills. Start with the basics and turn your ideas into real projects.",
    date: "4 min read"
  },
  {
    id: "4",
    title: "Make Room for Creativity",
    category: "Creativity",
    content: "Creativity grows when you experiment. Collect ideas, try new things, and remember that your first attempt does not need to be perfect.",
    date: "3 min read"
  },
  {
    id: "5",
    title: "Learning in Public",
    category: "Personal",
    content: "Sharing what you learn helps you reflect, connect with others, and track your progress. You do not need to be an expert to begin.",
    date: "4 min read"
  },
  {
    id: "6",
    title: "A Beginner's Guide to the Web",
    category: "Technology",
    content: "HTML builds the structure, CSS adds the design, and JavaScript creates interactions. Together, they are the foundation of many websites.",
    date: "6 min read"
  }
];

// Load saved posts
function loadBlogs() {
  try {
    const saved = localStorage.getItem("myBlogPosts");

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.log("Could not load saved posts.");
  }

  return [...sampleBlogs];
}

let blogs = loadBlogs();
let activeCategory = "All";

// Save posts in the browser
function saveBlogs() {
  try {
    localStorage.setItem("myBlogPosts", JSON.stringify(blogs));
  } catch (error) {
    alert("Your browser could not save the posts.");
  }
}

// Create category filter buttons
function renderFilters() {
  const categories = [
    "All",
    ...new Set(blogs.map(blog => blog.category))
  ];

  filters.replaceChildren();

  categories.forEach(category => {
    const button = document.createElement("button");

    button.className = "filter-btn";
    button.textContent = category;

    if (activeCategory === category) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderBlogs();
    });

    filters.appendChild(button);
  });
}

// Display blog posts
function renderBlogs() {
  const query = searchInput.value.toLowerCase().trim();

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch =
      blog.title.toLowerCase().includes(query) ||
      blog.category.toLowerCase().includes(query) ||
      blog.content.toLowerCase().includes(query);

    const matchesCategory =
      activeCategory === "All" ||
      blog.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  container.replaceChildren();

  filteredBlogs.forEach(blog => {
    const card = document.createElement("article");
    card.className = "blog-card";

    const top = document.createElement("div");
    top.className = "card-top";

    const category = document.createElement("span");
    category.className = "category";
    category.textContent = blog.category;

    const readTime = document.createElement("span");
    readTime.className = "read-time";
    readTime.textContent = blog.date || "Community post";

    top.append(category, readTime);

    const title = document.createElement("h3");
    title.textContent = blog.title;

    const content = document.createElement("p");
    content.textContent = blog.content;

    const footer = document.createElement("div");
    footer.className = "card-footer";

    const date = document.createElement("span");
    date.className = "card-date";
    date.textContent = blog.custom ? "Your post" : "MyBlog";

    footer.appendChild(date);

    if (blog.custom) {
      const deleteBtn = document.createElement("button");

      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete ×";

      deleteBtn.addEventListener("click", () => {
        blogs = blogs.filter(item => item.id !== blog.id);
        saveBlogs();
        renderFilters();
        renderBlogs();
      });

      footer.appendChild(deleteBtn);
    }

    card.append(top, title, content, footer);
    container.appendChild(card);
  });

  noResults.hidden = filteredBlogs.length > 0;
}

// Search posts
searchInput.addEventListener("input", renderBlogs);

// Add a new blog
blogForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const title = document.getElementById("blogTitle").value.trim();
  const category = document.getElementById("blogCategory").value;
  const content = document.getElementById("blogContent").value.trim();

  if (!title || !content) {
    alert("Please fill in all fields.");
    return;
  }

  blogs.unshift({
    id: Date.now().toString(),
    title: title,
    category: category,
    content: content,
    date: new Date().toLocaleDateString(),
    custom: true
  });

  saveBlogs();

  activeCategory = "All";
  searchInput.value = "";

  blogForm.reset();

  renderFilters();
  renderBlogs();

  document.getElementById("blogs").scrollIntoView({
    behavior: "smooth"
  });
});

// Dark mode
function setTheme(dark) {
  document.body.classList.toggle("dark", dark);
  themeBtn.textContent = dark ? "☀️" : "🌙";
}

try {
  setTheme(localStorage.getItem("myBlogTheme") === "dark");
} catch {
  setTheme(false);
}

themeBtn.addEventListener("click", function() {
  const dark = !document.body.classList.contains("dark");

  setTheme(dark);

  try {
    localStorage.setItem("myBlogTheme", dark ? "dark" : "light");
  } catch {}
});

// Start the website
renderFilters();
renderBlogs();
