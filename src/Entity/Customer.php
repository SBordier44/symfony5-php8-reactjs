<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Annotation\ApiSubresource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\SearchFilter;
use App\Repository\CustomerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use JetBrains\PhpStorm\Pure;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;

/**
 * @ORM\Entity(repositoryClass="App\Repository\CustomerRepository", repositoryClass=CustomerRepository::class)
 */
#[ApiResource(
    collectionOperations: [Request::METHOD_GET, Request::METHOD_POST],
    itemOperations: [Request::METHOD_GET, Request::METHOD_PUT, Request::METHOD_PATCH, Request::METHOD_DELETE],
    normalizationContext: ['groups' => ['customers_read']]
)]
#[ApiFilter(SearchFilter::class)]
#[ApiFilter(OrderFilter::class)]
class Customer
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[Groups(['customers_read', 'invoices_read'])]
    private int $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups(['customers_read', 'invoices_read'])]
    #[NotBlank(message: "Le prénom du client est obligatoire")]
    #[Length(
        min: 2,
        max: 50,
        minMessage: "Le prénom doit contenir au moins {{ limit }} caractères",
        maxMessage: "Le prénom ne peut pas dépasser {{ limit }} caractères"
    )]
    private string $firstName;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups(['customers_read', 'invoices_read'])]
    #[NotBlank(message: "Le nom de famille du client est obligatoire")]
    #[Length(
        min: 2,
        max: 50,
        minMessage: "Le nom de famille doit contenir au moins {{ limit }} caractères",
        maxMessage: "Le nom de famille ne peut pas dépasser {{ limit }} caractères"
    )]
    private string $lastName;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups(['customers_read', 'invoices_read'])]
    #[NotBlank(message: "L'adresse Email du client est obligatoire")]
    #[Email(message: "Le format de l'adresse email doit être valide")]
    private string $email;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    #[Groups(['customers_read', 'invoices_read'])]
    private ?string $company = null;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Invoice", mappedBy="customer")
     */
    #[Groups(['customers_read'])]
    #[ApiSubresource]
    private ArrayCollection|Collection|array $invoices;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\User", inversedBy="customers")
     * @ORM\JoinColumn(nullable=false)
     */
    #[Groups(['customers_read'])]
    #[ApiSubresource]
    #[NotBlank(message: "L'utilisateur propriétaire du client est obligatoire")]
    private UserInterface $owner;

    #[Pure]
    public function __construct()
    {
        $this->invoices = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getCompany(): ?string
    {
        return $this->company;
    }

    public function setCompany(?string $company): self
    {
        $this->company = $company;

        return $this;
    }

    public function getInvoices(): Collection|ArrayCollection|array
    {
        return $this->invoices;
    }

    public function addInvoice(Invoice $invoice): self
    {
        if (!$this->invoices->contains($invoice)) {
            $this->invoices[] = $invoice;
            $invoice->setCustomer($this);
        }

        return $this;
    }

    public function removeInvoice(Invoice $invoice): self
    {
        if ($this->invoices->removeElement($invoice) && $invoice->getCustomer() === $this) {
            $invoice->setCustomer(null);
        }

        return $this;
    }

    public function getOwner(): ?UserInterface
    {
        return $this->owner;
    }

    public function setOwner(UserInterface $owner): self
    {
        $this->owner = $owner;

        return $this;
    }
}
