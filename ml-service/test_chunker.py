from app.services.chunker import chunk_file

sample_python = '''
import os

def calculate_total(items):
    total = 0
    for item in items:
        total += item.price
    return total

class ShoppingCart:
    def __init__(self):
        self.items = []

    def add_item(self, item):
        self.items.append(item)

def apply_discount(total, percent):
    return total * (1 - percent / 100)
'''

chunks = chunk_file(sample_python, "cart.py")

print(f"Found {len(chunks)} chunks:\\n")
for c in chunks:
    print(f"  [{c['function_name']}] lines {c['start_line']}-{c['end_line']}")
    print(f"  {c['content'][:60]}...")
    print()