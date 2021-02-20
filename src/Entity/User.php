<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JetBrains\PhpStorm\Pure;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

/**
 * @ORM\Entity(repositoryClass=UserRepository::class)
 */
#[ApiResource(
    denormalizationContext: ['groups' => ['users_write']],
    normalizationContext: ['groups' => ['users_read']]
)]
#[UniqueEntity(fields: ['email'], message: "Un utilisateur existe déjà avec cette adresse email")]
class User implements UserInterface
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource', 'users_read'])]
    private int $id;

    /**
     * @ORM\Column(type="string", length=180, unique=true)
     */
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource', 'users_read', 'users_write'])]
    #[NotBlank(message: "L'adresse email est obligatoire")]
    #[Email(message: "L'adresse email doit être valide", mode: Email::VALIDATION_MODE_STRICT)]
    private string $email;

    /**
     * @ORM\Column(type="json")
     */
    private array $roles = [];

    /**
     * @ORM\Column(type="string")
     */
    #[NotBlank(message: "Le mot de passe est obligatoire")]
    #[Length(min: 8, minMessage: "Le mot de passe doit faire minimum {{ limit }} caractères")]
    #[Groups(['users_write'])]
    private string $password;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource', 'users_read', 'users_write'])]
    #[NotBlank(message: "Le prénom de l'utilisateur est obligatoire")]
    #[Length(min: 2, max: 50, minMessage: 'Le prénom doit faire au minimum {{ limit }} caractères', maxMessage: "Le prénom ne peux pas dépasser {{ limit }} caractères")]
    private string $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource', 'users_read', 'users_write'])]
    #[NotBlank(message: "Le nom de famille de l'utilisateur est obligatoire")]
    #[Length(min: 2, max: 50, minMessage: 'Le nom de famille doit faire au minimum {{ limit }} caractères', maxMessage: "Le nom de famille ne peux pas dépasser {{ limit }} caractères")]
    private string $lastName;

    /**
     * @ORM\OneToMany(targetEntity=Customer::class, mappedBy="owner")
     */
    #[Groups(['users_read'])]
    private ArrayCollection|Collection|array $customers;

    #[Pure]
    public function __construct()
    {
        $this->customers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getUsername(): string
    {
        return $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getSalt(): ?string
    {
        return null;
    }

    public function eraseCredentials(): void
    {
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getCustomers(): Collection|ArrayCollection|array
    {
        return $this->customers;
    }

    public function addCustomer(Customer $customer): self
    {
        if (!$this->customers->contains($customer)) {
            $this->customers[] = $customer;
            $customer->setOwner($this);
        }

        return $this;
    }

    public function removeCustomer(Customer $customer): self
    {
        if ($this->customers->removeElement($customer) && $customer->getOwner() === $this) {
            $customer->setOwner(null);
        }

        return $this;
    }
}
