const supertest = require("supertest");
const app = require("../app");

const Blog = require("../models/blog");

const api = supertest(app);

const helper = require("../utils/test_helper");

beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
});

describe("when there is initially some blogs saved", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("unique identifier property of the blog posts is named id", async () => {
    const blogs = await (await api.get("/api/blogs")).body;
    blogs.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

