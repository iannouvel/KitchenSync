import scrapy
import json
import re
from datetime import datetime


class YotamspiderSpider(scrapy.Spider):
    name = "yotamspider"
    allowed_domains = ["www.theguardian.com"]
    
    def __init__(self, num_recipes=None, *args, **kwargs):
        super(YotamspiderSpider, self).__init__(*args, **kwargs)
        self.consecutive_failures = 0
        self.max_failures = 3
        self.recipes_collected = 0
        self.visited_urls = set()  # Track visited URLs
        
        # If num_recipes wasn't passed as argument, ask for it
        if not num_recipes:
            while True:
                try:
                    num_recipes = int(input("How many recipes would you like to collect? "))
                    if num_recipes > 0:
                        break
                    print("Please enter a positive number")
                except ValueError:
                    print("Please enter a valid number")
        
        self.max_recipes = int(num_recipes)
        print(f"Will collect {self.max_recipes} recipes")
    
    def start_requests(self):
        # Start from current year
        current_year = datetime.now().year
        base_url = "https://www.theguardian.com/food/series/yotam-ottolenghi-recipes"
        yield scrapy.Request(base_url, 
                           self.parse_year_page, 
                           meta={'year': current_year, 'page': 1, 'base_url': base_url})

    def parse_year_page(self, response):
        # Stop if we've collected enough recipes
        if self.recipes_collected >= self.max_recipes:
            self.logger.info(f"Collected {self.recipes_collected} recipes - stopping")
            return
            
        current_year = response.meta['year']
        current_page = response.meta['page']
        base_url = response.meta['base_url']
        
        # Extract links from the page
        links = response.css('a[href*="/food/"][href*="recipes"]::attr(href)').getall()
        
        # Filter and clean links for current year only
        unique_links = set()
        for link in links:
            if link and '/all' not in link and '/series' not in link and 'ask-ottolenghi' not in link:
                year_match = re.search(r'/(\d{4})/', link)
                if year_match and int(year_match.group(1)) <= current_year:
                    unique_links.add(link)
        
        if unique_links:
            # Reset failure counter if we found links
            self.consecutive_failures = 0
            self.logger.info(f"Found {len(unique_links)} unique recipe links for year {current_year} (page {current_page})")
            
            for link in unique_links:
                if self.recipes_collected >= self.max_recipes:
                    return
                self.visited_urls.add(link)  # Mark URL as visited
                self.logger.debug(f"Found recipe link: {link}")
                yield response.follow(link, callback=self.parse_recipe)
            
            # Try next page for this year
            next_url = f"{base_url}?page={current_page + 1}"
            yield scrapy.Request(next_url, 
                               self.parse_year_page, 
                               meta={'year': current_year, 
                                    'page': current_page + 1,
                                    'base_url': base_url})
        else:
            # If no recipes found on this page, try previous year
            if current_page == 1:
                self.consecutive_failures += 1
                self.logger.info(f"No recipes found for year {current_year}. Consecutive failures: {self.consecutive_failures}")
                
                if self.consecutive_failures < self.max_failures:
                    next_year = current_year - 1
                    yield scrapy.Request(base_url,
                                       self.parse_year_page,
                                       meta={'year': next_year, 
                                            'page': 1,
                                            'base_url': base_url},
                                       dont_filter=True)
                else:
                    self.logger.info(f"Stopping after {self.max_failures} consecutive years with no recipes")

    def parse_recipe(self, response):
        # Stop if we've collected enough recipes
        if self.recipes_collected >= self.max_recipes:
            return
            
        # Extract recipe data from LD+JSON
        script = response.css('script[type="application/ld+json"]::text').get()
        if script:
            data = json.loads(script)
            # Only get unique recipes from the page
            seen_titles = set()
            for item in data:
                if item.get('@type') == 'Recipe':
                    title = item.get('name')
                    # Skip if we've already seen this recipe title
                    if title in seen_titles:
                        continue
                    seen_titles.add(title)
                    
                    self.recipes_collected += 1
                    self.logger.info(f"Collected recipe {self.recipes_collected} of {self.max_recipes}")
                    
                    yield {
                        'title': title,
                        'url': response.url,
                        'description': item.get('description'),
                        'ingredients': item.get('recipeIngredient', []),
                        'instructions': [step.get('text') for step in item.get('recipeInstructions', [])],
                        'prep_time': item.get('prepTime'),
                        'cook_time': item.get('cookTime'), 
                        'total_time': item.get('totalTime'),
                        'servings': item.get('recipeYield', [])[0] if item.get('recipeYield') else None,
                        'cuisine': item.get('recipeCuisine', []),
                        'category': item.get('recipeCategory', []),
                        'author': item.get('author', {}).get('name'),
                        'date_published': item.get('datePublished')
                    }
                    
                    # Close spider if we've collected enough recipes
                    if self.recipes_collected >= self.max_recipes:
                        self.logger.info("Reached target number of recipes - closing spider")
                        raise scrapy.exceptions.CloseSpider(reason='Reached target number of recipes')
