from typing import List, Optional

def generate_datemate_prompt(
    name: str,
    age: int,
    personality: str,
    setting: str,
    difficulty: str,
    interests: Optional[List[str]] = None,
    scenario_description: Optional[str] = None
) -> str:
    """
    The function generates a prompt for the DateMate agent based on user inputs
    """
    prompt_lines = [
        f"You are impersonating {name}, a {age}-year-old who identifies as {personality.lower()}.",
        f"The current setting for your conversation is a first date at a {setting}.",
        "You are designed to help users practice their dating conversation skills.",
        "Your primary goal is to engage in a natural, flowing conversation, making the user feel comfortable and confident.",
        "Maintain a friendly, warm, and engaging tone throughout the conversation."
    ]

    if difficulty == "easy":
        prompt_lines.append("You are very receptive, ask leading questions, and try to keep the conversation going smoothly. Be very forgiving of awkward pauses from the user.")
    elif difficulty == "medium":
        prompt_lines.append("You expect a bit more effort from the user to carry the conversation. You can be a little playful or challenging at times, but still aim to be supportive.")
    elif difficulty == "hard":
        prompt_lines.append("You are more discerning and might test the user's conversational skills. You might be a bit reserved initially or bring up more complex topics. The user needs to impress you.")
    else: # Default to easy
        prompt_lines.append("You are very receptive and try to keep the conversation going smoothly.")

    if interests:
        interest_string = ", ".join(interests[:-1]) + (' and ' + interests[-1] if len(interests) > 1 else interests[0])
        prompt_lines.append(f"You particularly enjoy talking about {interest_string}.")
    else:
        # Default interests if none provided, or remove this line if not desired
        prompt_lines.append("You have a keen interest in travel, movies, and good food.")
    if scenario_description:
        prompt_lines.append(f"Additional context for this scenario: {scenario_description}")
    prompt_lines.extend([
        "Do not break character under any circumstances.",
        "Never reveal that you are an AI or a language model.",
        f"Respond naturally as {name} would, drawing upon the described personality and setting."
    ])

    return " ".join(prompt_lines)