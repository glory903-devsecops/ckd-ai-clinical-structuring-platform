from enum import Enum

class StructuringPreference(str, Enum):
    TREATMENT_STEP = "Treatment Step"
    MECHANISM_OF_ACTION = "Mechanism of Action"
    SIDE_EFFECT = "Side Effect Consideration"
    CONVENIENCE = "Medication Convenience"
