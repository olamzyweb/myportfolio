#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const BLOG_ROOT = path.resolve(__dirname, '..');
const INDEX_FILE = path.join(BLOG_ROOT, 'data', 'posts.json');
const POSTS_DIR = path.join(BLOG_ROOT, 'posts');

function readJson(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
}

function requiredString(obj, key, errors, label) {
    if (typeof obj[key] !== 'string' || obj[key].trim() === '') {
        errors.push(`${label}: missing or invalid '${key}'`);
    }
}

function validateDate(value) {
    return !Number.isNaN(Date.parse(value));
}

function main() {
    const errors = [];

    if (!fs.existsSync(INDEX_FILE)) {
        console.error(`Missing index file: ${INDEX_FILE}`);
        process.exit(1);
    }

    const indexData = readJson(INDEX_FILE);
    if (!Array.isArray(indexData.posts)) {
        console.error("Invalid posts.json: expected 'posts' array");
        process.exit(1);
    }

    const seenSlugs = new Set();

    indexData.posts.forEach((post, idx) => {
        const label = `posts.json entry #${idx + 1}`;
        requiredString(post, 'id', errors, label);
        requiredString(post, 'slug', errors, label);
        requiredString(post, 'title', errors, label);
        requiredString(post, 'excerpt', errors, label);
        requiredString(post, 'publishedAt', errors, label);

        if (typeof post.slug === 'string') {
            if (seenSlugs.has(post.slug)) {
                errors.push(`${label}: duplicate slug '${post.slug}'`);
            }
            seenSlugs.add(post.slug);
        }

        if (post.publishedAt && !validateDate(post.publishedAt)) {
            errors.push(`${label}: invalid publishedAt date '${post.publishedAt}'`);
        }

        if (!Array.isArray(post.categories)) {
            errors.push(`${label}: 'categories' must be an array`);
        }
    });

    if (!fs.existsSync(POSTS_DIR)) {
        errors.push(`Missing posts directory: ${POSTS_DIR}`);
    } else {
        seenSlugs.forEach(slug => {
            const postFile = path.join(POSTS_DIR, `${slug}.json`);
            if (!fs.existsSync(postFile)) {
                errors.push(`Missing post file for slug '${slug}': ${postFile}`);
                return;
            }

            let postData;
            try {
                postData = readJson(postFile);
            } catch (error) {
                errors.push(`Invalid JSON in ${postFile}: ${error.message}`);
                return;
            }

            const label = `post file '${slug}.json'`;
            requiredString(postData, 'id', errors, label);
            requiredString(postData, 'slug', errors, label);
            requiredString(postData, 'title', errors, label);
            requiredString(postData, 'publishedAt', errors, label);

            if (postData.slug !== slug) {
                errors.push(`${label}: slug mismatch (expected '${slug}', found '${postData.slug}')`);
            }

            if (!Array.isArray(postData.content) || postData.content.length === 0) {
                errors.push(`${label}: content must be a non-empty array`);
            }
        });
    }

    if (errors.length) {
        console.error('Post validation failed:\n');
        errors.forEach(error => console.error(`- ${error}`));
        process.exit(1);
    }

    console.log(`Validation passed: ${seenSlugs.size} posts checked.`);
}

main();
