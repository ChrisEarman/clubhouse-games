import random
from collections import defaultdict
from pprint import pprint


class SpellingBee:
    DICTIONARY_LOCATION = "Collins Scrabble Words (2019) with definitions.txt"
    ALPHABET = set("ABCDEFGHIJKLMNOPQRSTUVWXYZ")

    def __init__(self):
        # contains a Key, Value mapping of words to their definitions
        self.dictionary = {}
        # a Set of strings of 7 unique characters which have valid pangrams they can make
        self.valid_char_sets = set()
        # collection of word sets if they contain a given character (the key)
        self.containing_set = defaultdict(set)
        self.load_dictionary()

        # a cache of valid words for given valid_char_sets
        self.game_cache = {}

    def load_dictionary(self):
        """
        Loads the dictionary from the file into the game state. This function is responsible for loading:
        - dictionary: {str: str} - a mapping of valid SpellingBee words (4 or more letters) to their definitions
        - containing_set: {str: set(str)} - key: a letter, value: a set of words which contain the key letter
        - valid_char_set: set(str) - a set of 7-character strings which represent valid SpellingBee games
        :return: None
        """
        with open(SpellingBee.DICTIONARY_LOCATION, 'r') as f:
            lines = f.readlines()
            for line in lines[2:]:
                word, definition = line.split(None, 1)
                if len(word) >= 4:  # The words have to be at least 4 letters long
                    char_set = set(word)
                    if len(char_set) <= 7:  # The words cannot have more than 7 unique characters
                        if len(char_set) == 7:  # If the word has exactly 7 unique characters, its a potential pangram
                            self.valid_char_sets.add("".join(sorted(char_set)))  # store sorted to prevent repeats
                        for c in char_set:
                            self.containing_set[c].add(word)  # add word to the containing set for each of its letters
                        self.dictionary[word] = definition

    def pick_letter_set(self) -> str:
        """
        Randomly chooses a value from valid_char_set to seed a SpellingBee game
        :return: A string representing a valid letter set for a SpellingBee game
        """
        return random.choice(list(self.valid_char_sets))

    def pangrams(self, char_set: str, perfect: bool = False) -> [str]:
        """
        Produces the valid Pangrams for a given character set.
        This is achieved by intersecting the containing_set value for each character in the character set.
        :param char_set: a 7 letter set for a given SpellingBee game
        :param perfect: a boolean value, determines if only Perfect Pangrams (using each letter once) are returned
        :return: a list of all the valid Pangrams
        """
        valid_set = self.containing_set[char_set[0]]
        for c in char_set[1:]:
            valid_set = valid_set.intersection(self.containing_set[c])
        # the below list comprehension filters on char_set length to find perfect pangrams if asked
        # char_set length should always be 7, but not enforced in this method.
        return [word for word in valid_set if len(word) == len(char_set) or not perfect]

    def fetch_valid_words(self, char_set: str, prime_letter: str) -> [str]:
        """
        Produces the set of valid words for a given character set and prime letter.
        This is achieved by
            1. Fetch the set of all words which contain the prime letter
                (a simple looking from containing_set)
            2. Remove all words which contain a letter not in the char_set
                (set difference with all containing_set values of non-char_set letters)
        :param char_set: a 7 letter set for a given SpellingBee game
        :param prime_letter: the prime letter which must be included in all words
        :return: a list of valid answer words for the SpellingBee game
        """
        if (char_set, prime_letter) in self.game_cache:
            return self.game_cache[(char_set, prime_letter)]

        valid_words = self.containing_set[prime_letter]

        # remove any words which contain letters not in the char_set
        for letter in SpellingBee.ALPHABET:
            if letter not in char_set:
                valid_words.difference_update(self.containing_set[letter])

        # load the valid words into the game cache
        self.game_cache[(char_set, prime_letter)] = valid_words
        return valid_words

    def hint_word_starters(self, char_set: str, prime_letter: str):
        """
        :param char_set:
        :param prime_letter:
        :return:
        """
        valid_words = self.fetch_valid_words(char_set, prime_letter)

        starter_counts = defaultdict(int)
        for word in valid_words:
            starter_counts[word[:2]] += 1

        cur = None
        out = ""
        for starter in starter_counts.keys():
            if cur != starter[0]:
                cur = starter[0]
                out += "\n"
            # out +=

    def hint_dougs_grid(self, char_set: str, prime_letter: str):
        pass


def censor(s: str):
    """
    Censored Print, does not print all Caps words (which are dictionary words and give away in definitions)
    """
    return " ".join([token if token != token.upper() else "*"*len(token) + token for token in s.split()])


if __name__ == "__main__":
    sb = SpellingBee()
    letters = sb.pick_letter_set()
    print(letters)
    # print(pl)
    # valid_words = sb.fetch_valid_words(char_set=letters, prime_letter=pl)
    # print("---------")
    # print(valid_words)
    # print(len(valid_words))
    # print("---------")
    print(sb.pangrams(char_set=letters))
    print(sb.pangrams(char_set=letters, perfect=True) if sb.pangrams(char_set=letters, perfect=True) else "No Perfect Pangram")
    # sb.hint_word_starters(letters,pl)

    # options = sb.fetch_valid_words(char_set="TIZVENC", prime_letter="I")
    # options = sb.fetch_valid_words(char_set="GATNIRY", prime_letter="Y")
    # options = sb.fetch_valid_words(char_set="MAILBOX", prime_letter="O")
    # options = sb.fetch_valid_words(char_set="HEADWIN", prime_letter="W")
    options = sb.fetch_valid_words(char_set="DUNORCT", prime_letter="N")
    print(len(options))

    for option in sorted(options):
        if "CO" == option[:2] and len(option) == 6 and option not in ["CONDOR", "CORDON", "COTTON", "CONCUR"]:
            print(censor(option), "[{}]".format(len(option)), censor(sb.dictionary[option]))

    # print(sb.pangrams(char_set="MAILBOX"))
    # print(sb.pangrams(char_set="MAILBOX", perfect=True))
    # print(sb.pangrams(char_set="GATNIRY"))
    # print(sb.pangrams(char_set="GATNIRY", perfect=True))
    print(sb.pangrams(char_set="HEADWIN"))
    print(sb.pangrams(char_set="HEADWIN", perfect=True))

