import argparse
import json
import os
import random
from pathlib import Path
from typing import Dict, List, Tuple

FACES = [-1, 0, 1]
SYMBOLS = { -1: '-', 0: '0', 1: '+' }
TRACKS_FILE = Path.home() / '.fate_tracks.json'


def roll_fate_once(rng: random.Random) -> Tuple[List[int], int]:
    """Roll 4 Fate dice once. Returns the face list and total.
    Each die has equal chance of -1, 0, +1.
    """
    faces = [rng.choice(FACES) for _ in range(4)]
    total = sum(faces)
    return faces, total


def score_with_modifier(total: int, modifier: int) -> int:
    return total + modifier


def best_of_two(a: int, b: int, take: str) -> int:
    if take == 'high':
        return max(a, b)
    if take == 'low':
        return min(a, b)
    raise ValueError("take must be 'high' or 'low'")


def format_faces(faces: List[int]) -> str:
    return ''.join(SYMBOLS[f] for f in faces)


def outcome_from_shift(shift: int) -> str:
    """Map the shift (final - DC) to a Fate-style outcome label."""
    if shift >= 3:
        return 'Success with Style'
    if shift >= 1:
        return 'Success'
    if shift == 0:
        return 'Tie'
    return 'Fail'


def gm_instruction(shift: int) -> str:
    """Provide GM phrasing guidance based on shift."""
    label = outcome_from_shift(shift)
    if label == 'Success with Style':
        return 'They achieve the goal decisively and gain a boost. Describe flourish, advantage, or momentum.'
    if label == 'Success':
        return 'They succeed cleanly. Move forward; highlight competence and progress.'
    if label == 'Tie':
        return 'They get a narrow success at a minor cost, or create a boost for next action.'
    # Fail
    if shift <= -3:
        return 'They fail hard. Escalate trouble or offer success-at-a-serious-cost as a choice.'
    return 'They fail. Introduce a complication or present success-at-a-cost as an option.'


def roll(
    times: int,
    modifier: int,
    mode: str,  # 'normal' | 'advantage' | 'disadvantage'
    seed: int | None,
    verbose: bool,
    dc: int | None,
) -> None:
    rng = random.Random(seed)

    for i in range(1, times + 1):
        if mode == 'normal':
            faces, base = roll_fate_once(rng)
            final = score_with_modifier(base, modifier)
            if dc is not None:
                shift = final - dc
                if verbose:
                    print(
                        f"Roll {i}: faces={format_faces(faces)} base={base} modifier={modifier:+d} => total={final} | DC={dc} => shift={shift} | outcome={outcome_from_shift(shift)}"
                    )
                    print(f"GM: {gm_instruction(shift)}")
                else:
                    print(shift)
            else:
                if verbose:
                    print(f"Roll {i}: faces={format_faces(faces)} base={base} modifier={modifier:+d} => total={final}")
                else:
                    print(final)
        else:
            # Roll twice, pick best/worst on final score including modifier
            faces1, base1 = roll_fate_once(rng)
            faces2, base2 = roll_fate_once(rng)
            total1 = score_with_modifier(base1, modifier)
            total2 = score_with_modifier(base2, modifier)
            take = 'high' if mode == 'advantage' else 'low'
            chosen = best_of_two(total1, total2, take)
            if dc is not None:
                shift = chosen - dc
                if verbose:
                    arrow = '>' if total1 > total2 else '<' if total1 < total2 else '='
                    print(
                        f"Roll {i} ({mode}): "
                        f"A faces={format_faces(faces1)} base={base1} mod={modifier:+d} => {total1} {arrow} "
                        f"B faces={format_faces(faces2)} base={base2} mod={modifier:+d} => {total2} "
                        f"=> chosen {chosen} | DC={dc} => shift={shift} | outcome={outcome_from_shift(shift)}"
                    )
                    print(f"GM: {gm_instruction(shift)}")
                else:
                    print(shift)
            else:
                if verbose:
                    arrow = '>' if total1 > total2 else '<' if total1 < total2 else '='
                    print(
                        f"Roll {i} ({mode}): "
                        f"A faces={format_faces(faces1)} base={base1} mod={modifier:+d} => {total1} {arrow} "
                        f"B faces={format_faces(faces2)} base={base2} mod={modifier:+d} => {total2} "
                        f"=> chosen {chosen}"
                    )
                else:
                    print(chosen)


# ===== TRACK MANAGEMENT =====

def load_tracks() -> Dict[str, Dict]:
    """Load tracks from JSON file."""
    if not TRACKS_FILE.exists():
        return {}
    try:
        with open(TRACKS_FILE, 'r') as f:
            return json.load(f)
    except (json.JSONDecodeError, IOError):
        return {}


def save_tracks(tracks: Dict[str, Dict]) -> None:
    """Save tracks to JSON file."""
    with open(TRACKS_FILE, 'w') as f:
        json.dump(tracks, f, indent=2)


def create_track(name: str, boxes: int, description: str = '') -> None:
    """Create a new progress track."""
    tracks = load_tracks()
    if name in tracks:
        print(f"Error: Track '{name}' already exists. Use a different name or remove the existing track first.")
        return
    if boxes < 1:
        print("Error: Track must have at least 1 box.")
        return
    tracks[name] = {
        'total': boxes,
        'checked': 0,
        'description': description
    }
    save_tracks(tracks)
    print(f"[OK] Created track '{name}' with {boxes} boxes.")
    if description:
        print(f"  Description: {description}")


def list_tracks() -> None:
    """List all progress tracks."""
    tracks = load_tracks()
    if not tracks:
        print("No tracks found. Create one with: --track-create")
        return
    print("\n=== ACTIVE TRACKS ===")
    for name, data in sorted(tracks.items()):
        checked = data['checked']
        total = data['total']
        progress = '#' * checked + '-' * (total - checked)
        status = '[COMPLETE]' if checked >= total else f'{checked}/{total}'
        print(f"\n{name}: [{progress}] {status}")
        if data.get('description'):
            print(f"  > {data['description']}")
    print()


def tick_track(name: str, amount: int = 1) -> None:
    """Mark boxes as checked on a track."""
    tracks = load_tracks()
    if name not in tracks:
        print(f"Error: Track '{name}' not found. Use --track-list to see all tracks.")
        return
    track = tracks[name]
    old_checked = track['checked']
    track['checked'] = min(track['checked'] + amount, track['total'])
    save_tracks(tracks)
    
    new_checked = track['checked']
    total = track['total']
    progress = '#' * new_checked + '-' * (total - new_checked)
    
    if new_checked >= total:
        print(f"*** Track '{name}' COMPLETED! [{progress}]")
    else:
        print(f"[OK] Track '{name}' updated: [{progress}] {new_checked}/{total}")
        if amount > 1:
            print(f"  (Marked {amount} boxes)")


def add_boxes(name: str, boxes: int, reason: str = '') -> None:
    """Add boxes to a track (e.g., due to complications from a bad fail)."""
    tracks = load_tracks()
    if name not in tracks:
        print(f"Error: Track '{name}' not found. Use --track-list to see all tracks.")
        return
    if boxes < 1:
        print("Error: Must add at least 1 box.")
        return
    track = tracks[name]
    track['total'] += boxes
    save_tracks(tracks)
    
    checked = track['checked']
    total = track['total']
    progress = '#' * checked + '-' * (total - checked)
    
    print(f"[!] Added {boxes} box(es) to '{name}': [{progress}] {checked}/{total}")
    if reason:
        print(f"  Reason: {reason}")


def rename_track(old_name: str, new_name: str) -> None:
    """Rename a track."""
    tracks = load_tracks()
    if old_name not in tracks:
        print(f"Error: Track '{old_name}' not found.")
        return
    if new_name in tracks:
        print(f"Error: Track '{new_name}' already exists.")
        return
    tracks[new_name] = tracks.pop(old_name)
    save_tracks(tracks)
    print(f"[OK] Renamed track '{old_name}' to '{new_name}'")


def remove_track(name: str, force: bool = False) -> None:
    """Remove a track."""
    tracks = load_tracks()
    if name not in tracks:
        print(f"Error: Track '{name}' not found.")
        return
    track = tracks[name]
    if track['checked'] < track['total'] and not force:
        print(f"Warning: Track '{name}' is not complete ({track['checked']}/{track['total']}).")
        print("Use --force to remove anyway.")
        return
    del tracks[name]
    save_tracks(tracks)
    print(f"[OK] Removed track '{name}'")


def parse_args() -> argparse.Namespace:
    import sys
    
    # Check if first arg is 'track' to use new-style parsing
    if len(sys.argv) > 1 and sys.argv[1] == 'track':
        parser = argparse.ArgumentParser(
            description="Fate dice roller (4dF) with progress track management",
        )
        
        # Track commands
        track_subparsers = parser.add_subparsers(dest='track_command', help='Track operation')
        
        # Create track
        create_parser = track_subparsers.add_parser('create', help='Create a new progress track')
        create_parser.add_argument('name', help='Name of the track')
        create_parser.add_argument('boxes', type=int, help='Number of boxes in the track')
        create_parser.add_argument('-d', '--description', default='', help='Description of the track')
        
        # List tracks
        track_subparsers.add_parser('list', help='List all progress tracks')
        
        # Tick track
        tick_parser = track_subparsers.add_parser('tick', help='Mark box(es) as checked on a track')
        tick_parser.add_argument('name', help='Name of the track')
        tick_parser.add_argument('-c', '--count', type=int, default=1, help='Number of boxes to check. Default 1')
        
        # Add boxes (for complications)
        add_parser = track_subparsers.add_parser('add', help='Add boxes to a track (e.g., from a bad fail)')
        add_parser.add_argument('name', help='Name of the track')
        add_parser.add_argument('boxes', type=int, help='Number of boxes to add')
        add_parser.add_argument('-r', '--reason', default='', help='Reason for adding boxes')
        
        # Rename track
        rename_parser = track_subparsers.add_parser('rename', help='Rename a track')
        rename_parser.add_argument('old_name', help='Current name of the track')
        rename_parser.add_argument('new_name', help='New name for the track')
        
        # Remove track
        remove_parser = track_subparsers.add_parser('remove', help='Remove a track')
        remove_parser.add_argument('name', help='Name of the track to remove')
        remove_parser.add_argument('--force', action='store_true', help='Force removal even if incomplete')
        
        # Parse with 'track' removed
        args = parser.parse_args(sys.argv[2:])
        args.command = 'track'
        return args
    else:
        # Default to roll command (backward compatibility)
        parser = argparse.ArgumentParser(
            description="Fate dice roller (4dF) with modifier, DC comparison, GM instructions, and advantage/disadvantage",
        )
        parser.add_argument('-m', '--modifier', type=int, default=0, help='Modifier to add to the roll (can be negative). Default 0')
        mode_group = parser.add_mutually_exclusive_group()
        mode_group.add_argument('-a', '--advantage', action='store_true', help='Roll with advantage (roll twice, take higher total)')
        mode_group.add_argument('-d', '--disadvantage', action='store_true', help='Roll with disadvantage (roll twice, take lower total)')
        parser.add_argument('-n', '--times', type=int, default=1, help='Number of rolls to make. Default 1')
        parser.add_argument('-s', '--seed', type=int, default=None, help='Random seed for reproducibility')
        parser.add_argument('-v', '--verbose', action='store_true', help='Show dice faces and details')
        parser.add_argument('--dc', type=int, default=None, help='Difficulty Class to compare against. Output will be shift (total - DC).')
        args = parser.parse_args()
        args.command = 'roll'
        return args


def main() -> None:
    args = parse_args()
    
    if args.command == 'track':
        if args.track_command == 'create':
            create_track(args.name, args.boxes, args.description)
        elif args.track_command == 'list':
            list_tracks()
        elif args.track_command == 'tick':
            tick_track(args.name, args.count)
        elif args.track_command == 'add':
            add_boxes(args.name, args.boxes, args.reason)
        elif args.track_command == 'rename':
            rename_track(args.old_name, args.new_name)
        elif args.track_command == 'remove':
            remove_track(args.name, args.force)
        else:
            print("Use 'track --help' to see available track commands.")
    else:  # args.command == 'roll' or default
        mode = 'normal'
        if hasattr(args, 'advantage') and args.advantage:
            mode = 'advantage'
        elif hasattr(args, 'disadvantage') and args.disadvantage:
            mode = 'disadvantage'

        roll(
            times=max(1, args.times),
            modifier=args.modifier,
            mode=mode,
            seed=args.seed,
            verbose=args.verbose,
            dc=args.dc,
        )


if __name__ == '__main__':
    main()
