from pathlib import Path

def main():
    sample_dir = Path("data/sample")
    print(f"Sample data directory: {sample_dir.resolve()}")

if __name__ == "__main__":
    main()
