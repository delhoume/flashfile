# FlashFile
A specification for a FlashInvader exchange format


The street artist known as **Invader** disposes mosaics originaly inspired by 8 bit videogames all over the world.
The mosaics can be *flashed* and collected in a smartphone application called FlashInvaders.

It is currently not possible to exchange or export the flashed mosaic list

The FlashFile format is a compact format to describe lists of items that can be Invader's mosaics.



# Specification

## Items
The format describes a list of items.
Each item has a unique name in the LOCATION_ORDER format.

Example : ```NY_100``` ```PA_27``` ```PA_1500``` ```SPACE_02```

lists of lots ot items take lot of space, this format is dedicated to minimize it.


## Format 
The format is text based and consists of a list of token, separated by spaces or newlines.
There can be comments starting from position 0 in a line or within a line provided all tokens in the line are valid.
Comments start with a ```#```  and extend to th end of the current line. Comment contents does not contribute to tokens.
Tokens are case sensistive.
Each token describes one or many item.

Example:

```
# this is valid
PA_1299 LA_18 # MARS_19 is not in the list
```

## LOCATION
A text value, usually a single word or symbol that describes uniquely the *location* part

Example: ```GRTI```

## ORDER
A value the describes a single *order* or a contiguous range of *orders*.

    - The range is absolute when the *order* part contain two numbers separatedd by a *comma* .
    number before the comma describes the lower bound value of the range and number after the comma
    desdcibes the upper bound value.

   - The range is relative when it *order part contains a *plus* +.
       - The number before is the absolute lower bound of the range
       - The optional number after the + sign is the number of consecutive items to consider.
         When not present is value is set to 1
         
 Exemples: 
```12```     the item with order 12
```43,53``` the items with order from 43 to 53 included
```23+3```  the items with order from 23 to 26 included
```17+```  the items with order 17 and 18


## Tokens
There are 2 types of tokens

### Tokens with **LOCATION** part
They define the *location* part of the item for all following tokens until set by another.
the token is build using a **LOCATION**, and an **ORDER**. separated by an underscore ```_```

  - token with *order* part
    defines the *location* of the item and sets the **implicit location** to its location, and the **implicit mode*** to *add*
example:
```TK_28 HK_04,10 KAT_10+3```

### Tokens with **ORDER** part
They define the *order* part of the item for the **implicit location**.

They can be part of a token with location or be a token on their own.
If the token has no **LOCATION** part, the **implicit location** is used to resolve
the location

## implicit location
The implicit location decides what LOCATION an **ORDER** only token is attributed to.
The implicit location is reset to itself by any of the explicit LOCATION tokens 
exemple:
```
FTBL_17
20,22 # means # FTBL_20 FTBL_21 FTBL_22
AMS_12
18    # means # AMS_18
```

Exemple:
```
ROM_03         # add ROM_03 to the list, sets ROM as the implicit location and ADD implicit mode
19 27,29       # adds ROM_19 ROM_27 ROM_28 ROM_29 to the list
DIJ_01+5            # adds DIJ_01 DIJ_02 DIJ_03 DIJ_04 DIJ_05 DIJ_06
````


### issue with implicit mode
This mode allow for very short encoding of "all" items in a location but the concept of "all" 
is a moving target, as the number of referenced items might increase.

This means the token describes a situation at a moment in time and that the number of items in the location must be known at the time.
If the number of items is likely to vary the use of **LOCATION** only tokens is discouraged.


# application to FlashInvaders lists

This format allows for very concise description of mosaics flashed in the world, 

The compression ratio is vey high compared to a "flat" list of every item

Paris is under constant *invasion* and the total number of referenced mosaics increases very often so the use of single PA token is not recommended at all.
It happens that LIL (Lille) is the only invaded location in the world to have its order number start at 0 instead of 1.
An application will need to take care of this to resolve correctly LIL as LIL_00,05

- Order format is specific to Invader , order numbers < 10 have a  leading "0", as in NOO_01

- It is possible to encode any value in the comments but it is left to the application to interpret them.  It may be part of a future version of this specification to define a standard for values in comments, in the form of
```
# Date=xxxxx
# player=anonymous
```
    

#  usage

FlashFiles are optimized for FlashInvaders but can be used for any Location Order application.

The format is still very readable while beeing so concise.
Any list in the form of complete location is a valid FlashFile

It can be encoded in a QRCode as an URL and shared or sent in mails or messages.

# implementation

The format is very simple to parse, as it is separator based with a limited number of tokens and states.
A sample implementation is given in Javascript with a decoding tool.


A sample file for flashed mosaics from the Invader universe is provided in flashfile (1244 bytes)
and flat (16943 bytes)
This describes 2348  mosaics in 46 cities and is the flaslist of one of the top 250 players




